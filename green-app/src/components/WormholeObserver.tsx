"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  dnegRadius,
  ensembleOpticalShift,
  solveEuclideanBounce,
  traceBtzGeodesic,
  traceWormholeGeodesic,
  wormholeApparentAngle,
} from "@/lib/wormholeModels";

export type ObserverRegime = "lorentzian" | "euclidean" | "ads_btz" | "ensemble_ds";

export interface WormholeObserverProps {
  regime: ObserverRegime;
  onRegimeChange: (regime: ObserverRegime) => void;
  action: number;
  centralCharge: number;
  energyRatio: number;
  spread: number;
  fixed: boolean;
  sector: number;
}

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform float uTime;
  uniform int uRegime;        // 0: Lorentzian, 1: Euclidean pinch, 2: AdS BTZ, 3: Ensemble/dS
  uniform float uEll0;        // Observer proper distance ell_0
  uniform float uRho;         // Wormhole throat radius rho
  uniform float uHalfLen;     // Cylindrical throat half-length a
  uniform float uLensW;       // Lensing transition width W
  uniform float uYaw;         // Look yaw (rad)
  uniform float uPitch;       // Look pitch (rad)
  uniform float uOrbit;       // Slow sky orbit angle
  uniform float uShowGrid;    // 0 or 1 celestial grid overlay
  uniform float uAction;      // Euclidean delta I / hbar
  uniform float uPinch;       // 0..1 pinch-off factor
  uniform float uRPlus;       // BTZ horizon radius r_+ / ell_AdS
  uniform float uCentralC;    // Central charge c
  uniform float uShift;       // Ensemble spectral/coupling shift
  uniform float uEnsembleOn;  // 1 if ensemble averaging active, 0 if fixed sector
  uniform float uDeSitterMode;// 1 if showing dS horizon in regime 3, 0 if ensemble wormhole

  #define PI 3.14159265359

  // Hash & 3D noise for procedural stars and galactic dust lanes
  float hash31(vec3 p) {
    p = fract(p * vec3(443.897, 441.423, 437.195));
    p += dot(p, p.yzx + 19.19);
    return fract((p.x + p.y) * p.z);
  }

  float noise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float n000 = hash31(i + vec3(0.0, 0.0, 0.0));
    float n100 = hash31(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash31(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash31(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash31(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash31(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash31(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash31(i + vec3(1.0, 1.0, 1.0));
    return mix(
      mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
      mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
      f.z
    );
  }

  float fbm3(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise3(p);
      p = p * 2.07 + vec3(13.1, 7.7, 5.3);
      a *= 0.5;
    }
    return v;
  }

  vec3 starLayer(vec3 dir, float scale, float threshold, vec3 tintA, vec3 tintB) {
    vec3 p = dir * scale;
    vec3 id = floor(p);
    vec3 f = fract(p) - 0.5;
    float rnd = hash31(id);
    if (rnd < threshold) return vec3(0.0);
    vec3 offset = vec3(hash31(id + 1.3), hash31(id + 2.7), hash31(id + 4.1)) - 0.5;
    float d = length(f - offset * 0.55);
    float bright = smoothstep(0.24, 0.015, d);
    float temp = hash31(id + 9.2);
    vec3 col = mix(tintA, tintB, temp);
    float mag = pow((rnd - threshold) / (1.0 - threshold), 1.8);
    return col * bright * (0.45 + 1.9 * mag);
  }

  // Universe A: Deep sapphire/cyan cosmos + Galactic band
  vec3 sampleUniverseA(vec3 dir, float gridOn) {
    vec3 d = normalize(dir);
    // Tilt galactic plane
    vec3 g = normalize(vec3(d.x * 0.86 - d.y * 0.5, d.x * 0.5 + d.y * 0.86, d.z));
    float band = exp(-abs(g.y) * 5.2);
    float dust = fbm3(g * 4.5 + vec3(0.0, 0.0, 1.4));
    float darkLane = smoothstep(0.32, 0.68, fbm3(g * 8.0 + vec3(3.1)));

    vec3 bg = vec3(0.012, 0.032, 0.068);
    bg += vec3(0.05, 0.22, 0.42) * band * dust * (1.15 - 0.72 * darkLane);
    bg += vec3(0.16, 0.55, 0.78) * pow(band * dust, 2.2) * 0.65;

    // Brighter core on one side of sky
    float core = pow(max(0.0, dot(g, normalize(vec3(-0.6, 0.08, -0.78)))), 6.0);
    bg += vec3(0.28, 0.68, 0.92) * core * 0.55;

    bg += starLayer(d, 46.0, 0.89, vec3(0.68, 0.90, 1.0), vec3(1.0, 0.95, 0.85));
    bg += starLayer(d, 98.0, 0.92, vec3(0.50, 0.84, 1.0), vec3(0.85, 0.92, 1.0)) * 0.7;

    if (gridOn > 0.5) {
      float lat = abs(fract(asin(clamp(d.y, -1.0, 1.0)) * 6.0 / PI) - 0.5);
      float lon = abs(fract(atan(d.z, d.x) * 6.0 / PI) - 0.5);
      float line = smoothstep(0.035, 0.0, min(lat, lon));
      bg += vec3(0.18, 0.65, 0.88) * line * 0.26;
    }
    return bg;
  }

  // Universe B: Distinct warm amber-gold & magenta cosmos (seen through the throat)
  vec3 sampleUniverseB(vec3 dir, float gridOn, float shift) {
    vec3 d = normalize(dir);
    vec3 g = normalize(vec3(d.x * 0.76 + d.y * 0.65, -d.x * 0.65 + d.y * 0.76, d.z));
    float band = exp(-abs(g.y) * 4.4);
    float dust = fbm3(g * 4.2 + vec3(5.2, 1.8, 0.7));
    float lane = smoothstep(0.35, 0.72, fbm3(g * 7.5 + vec3(9.1)));

    vec3 bg = vec3(0.045, 0.020, 0.035);
    vec3 warmTint = mix(vec3(0.62, 0.34, 0.12), vec3(0.55, 0.22, 0.45), clamp(0.35 + shift, 0.0, 1.0));
    bg += warmTint * band * dust * (1.2 - 0.65 * lane);
    bg += vec3(0.98, 0.72, 0.34) * pow(band * dust, 2.1) * 0.75;

    float core = pow(max(0.0, dot(g, normalize(vec3(0.25, -0.1, -0.96)))), 5.0);
    bg += vec3(1.0, 0.78, 0.42) * core * 0.7;

    bg += starLayer(d, 44.0, 0.88, vec3(1.0, 0.86, 0.62), vec3(0.95, 0.75, 1.0));
    bg += starLayer(d, 92.0, 0.915, vec3(1.0, 0.92, 0.75), vec3(1.0, 0.68, 0.55)) * 0.75;

    if (gridOn > 0.5) {
      float lat = abs(fract(asin(clamp(d.y, -1.0, 1.0)) * 6.0 / PI) - 0.5);
      float lon = abs(fract(atan(d.z, d.x) * 6.0 / PI) - 0.5);
      float line = smoothstep(0.035, 0.0, min(lat, lon));
      bg += vec3(0.98, 0.68, 0.28) * line * 0.26;
    }
    return bg;
  }

  // Smooth DNEG / Morris-Thorne profile and derivative
  float dnegR(float ell, float rho, float a, float W) {
    float absEll = abs(ell);
    if (absEll <= a) return rho;
    float M = max(W / 1.42953, 0.001);
    float x = (2.0 * (absEll - a)) / (PI * M);
    return rho + M * (x * atan(x) - 0.5 * log(1.0 + x * x));
  }

  float dnegDr(float ell, float a, float W) {
    float absEll = abs(ell);
    if (absEll <= a) return 0.0;
    float M = max(W / 1.42953, 0.001);
    float x = (2.0 * (absEll - a)) / (PI * M);
    return sign(ell) * (2.0 / PI) * atan(x);
  }

  mat3 rotY(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c);
  }

  mat3 rotX(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c);
  }

  vec3 traceWormholeSky(vec3 rayDir, vec3 wHat, float rho, float a, float W, float ell0, float shift, float gridOn, float pinchAmount) {
    float pEll = dot(rayDir, wHat);
    vec3 kPerpVec = rayDir - pEll * wHat;
    float kPerpLen = length(kPerpVec);
    vec3 tHat = kPerpLen > 1e-6 ? (kPerpVec / kPerpLen) : normalize(cross(wHat, abs(wHat.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));

    float r0 = dnegR(ell0, rho, a, W);
    float b = r0 * kPerpLen;
    float ell = ell0;
    float phi = 0.0;
    float minAbsEll = abs(ell);
    float diskGlow = 0.0;

    // Effective sky radius for termination
    float skyBound = max(22.0, abs(ell0) + 12.0);

    for (int i = 0; i < 76; i++) {
      float h = clamp(0.11 + 0.045 * abs(ell), 0.08, 0.58);

      // RK4 integration of d(ell)/dl = pEll, d(pEll)/dl = b^2 r'(ell) / r^3, d(phi)/dl = b / r^2
      float r1 = dnegR(ell, rho, a, W);
      float dr1 = dnegDr(ell, a, W);
      float k1_e = pEll;
      float k1_p = (b * b * dr1) / (r1 * r1 * r1);
      float k1_f = b / (r1 * r1);

      float e2 = ell + 0.5 * h * k1_e;
      float p2 = pEll + 0.5 * h * k1_p;
      float r2 = dnegR(e2, rho, a, W);
      float dr2 = dnegDr(e2, a, W);
      float k2_e = p2;
      float k2_p = (b * b * dr2) / (r2 * r2 * r2);
      float k2_f = b / (r2 * r2);

      float e3 = ell + 0.5 * h * k2_e;
      float p3 = pEll + 0.5 * h * k2_p;
      float r3 = dnegR(e3, rho, a, W);
      float dr3 = dnegDr(e3, a, W);
      float k3_e = p3;
      float k3_p = (b * b * dr3) / (r3 * r3 * r3);
      float k3_f = b / (r3 * r3);

      float e4 = ell + h * k3_e;
      float p4 = pEll + h * k3_p;
      float r4 = dnegR(e4, rho, a, W);
      float dr4 = dnegDr(e4, a, W);
      float k4_e = p4;
      float k4_p = (b * b * dr4) / (r4 * r4 * r4);
      float k4_f = b / (r4 * r4);

      float nextEll = ell + (h / 6.0) * (k1_e + 2.0 * k2_e + 2.0 * k3_e + k4_e);
      pEll += (h / 6.0) * (k1_p + 2.0 * k2_p + 2.0 * k3_p + k4_p);
      phi += (h / 6.0) * (k1_f + 2.0 * k2_f + 2.0 * k3_f + k4_f);

      // Subtle glowing throat photon-sphere / dust ribbon near ell ~ 0
      vec3 localPos = (nextEll >= 0.0 ? 1.0 : -1.0) * (cos(phi) * wHat + sin(phi) * tHat);
      float eqDist = abs(localPos.y);
      if (abs(nextEll) < rho * 1.45 && eqDist < 0.14) {
        float swirl = fbm3(vec3(phi * 2.2 - uTime * 0.4, nextEll * 1.8, 2.0));
        diskGlow += exp(-abs(nextEll) * 1.9) * exp(-eqDist * 26.0) * (0.25 + 0.75 * swirl) * h * 0.22;
      }

      ell = nextEll;
      minAbsEll = min(minAbsEll, abs(ell));

      if (abs(ell) > skyBound && ell * pEll > 0.0) {
        break;
      }
    }

    vec3 outDir = (ell >= 0.0 ? 1.0 : -1.0) * cos(phi) * wHat + sin(phi) * tHat;
    outDir = rotY(uOrbit) * outDir;

    vec3 col;
    if (ell >= 0.0) {
      col = sampleUniverseA(outDir, gridOn);
    } else {
      col = sampleUniverseB(outDir, gridOn, shift);
      // In Euclidean pinch-off mode, portal dims and shifts toward instanton barrier glow
      col = mix(col, vec3(0.08, 0.16, 0.30), pinchAmount * 0.75);
    }

    // Natural Einstein-ring / photon-sphere caustic shimmer around critical impact parameter b ~ rho
    float critProx = exp(-pow((b - rho) / max(0.08, 0.09 * rho), 2.0));
    float windingGlow = smoothstep(PI * 0.85, PI * 2.4, phi);
    vec3 rimCol = mix(vec3(0.32, 0.82, 0.98), vec3(0.98, 0.74, 0.36), ell < 0.0 ? 0.65 : 0.25);
    col += rimCol * (critProx * 0.28 + windingGlow * 0.24);
    col += vec3(0.75, 0.88, 1.0) * clamp(diskGlow, 0.0, 0.9);

    return col;
  }

  // Mode 2: Inside the AdS3 / BTZ Black Hole Box (Cardy = Area / 4G)
  vec3 traceAdSBlackHole(vec3 rayDir, vec3 wHat, float rPlus, float cCharge, float gridOn) {
    float r0 = max(rPlus + 1.9, 4.4);
    float f0 = max(r0 * r0 - rPlus * rPlus, 0.15);

    // wHat points radially outward from black hole; camera looks toward -wHat
    float pr = dot(rayDir, wHat);
    vec3 kPerpVec = rayDir - pr * wHat;
    float kPerpLen = length(kPerpVec);
    vec3 tHat = kPerpLen > 1e-6 ? (kPerpVec / kPerpLen) : normalize(cross(wHat, abs(wHat.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));

    float b = (r0 * kPerpLen) / sqrt(f0);
    float r = r0;
    float phi = 0.0;
    float boxRadius = 9.5;
    bool hitHorizon = false;
    bool hitBox = false;
    vec3 diskAccum = vec3(0.0);

    for (int i = 0; i < 84; i++) {
      float h = clamp(0.045 * r, 0.035, 0.24);

      float k1_r = pr;
      float k1_p = -(b * b * rPlus * rPlus) / max(r * r * r, 0.001);
      float k1_f = b / max(r * r, 0.001);

      float r2 = max(r + 0.5 * h * k1_r, 0.05);
      float p2 = pr + 0.5 * h * k1_p;
      float k2_r = p2;
      float k2_p = -(b * b * rPlus * rPlus) / (r2 * r2 * r2);
      float k2_f = b / (r2 * r2);

      float r3 = max(r + 0.5 * h * k2_r, 0.05);
      float p3 = pr + 0.5 * h * k2_p;
      float k3_r = p3;
      float k3_p = -(b * b * rPlus * rPlus) / (r3 * r3 * r3);
      float k3_f = b / (r3 * r3);

      float r4 = max(r + h * k3_r, 0.05);
      float p4 = pr + h * k3_p;
      float k4_r = p4;
      float k4_p = -(b * b * rPlus * rPlus) / (r4 * r4 * r4);
      float k4_f = b / (r4 * r4);

      r += (h / 6.0) * (k1_r + 2.0 * k2_r + 2.0 * k3_r + k4_r);
      pr += (h / 6.0) * (k1_p + 2.0 * k2_p + 2.0 * k3_p + k4_p);
      phi += (h / 6.0) * (k1_f + 2.0 * k2_f + 2.0 * k3_f + k4_f);

      // Equatorial relativistic thermal/accretion disk around BTZ horizon
      vec3 pos3 = r * (cos(phi) * wHat + sin(phi) * tHat);
      float eq = abs(pos3.y);
      if (r > rPlus * 1.12 && r < rPlus * 3.1 && eq < 0.24) {
        float radialBand = smoothstep(rPlus * 1.12, rPlus * 1.45, r) * smoothstep(rPlus * 3.1, rPlus * 1.85, r);
        float angle = atan(pos3.z, pos3.x);
        float swirl = fbm3(vec3(cos(angle + uTime * 0.55) * 3.0, sin(angle + uTime * 0.55) * 3.0, r * 1.6));
        // Relativistic Doppler asymmetry
        float doppler = 0.72 + 0.48 * clamp(pos3.x / max(r, 0.1), -1.0, 1.0);
        vec3 plasma = mix(vec3(0.98, 0.68, 0.24), vec3(0.45, 0.88, 1.0), 0.35 * swirl);
        diskAccum += plasma * radialBand * exp(-eq * 18.0) * (0.35 + 0.85 * swirl) * doppler * h * 1.65;
      }

      if (r <= rPlus * 1.01) {
        hitHorizon = true;
        break;
      }
      if (r >= boxRadius) {
        hitBox = true;
        break;
      }
    }

    vec3 col = vec3(0.0);
    if (hitHorizon) {
      // Pure black hole shadow + subtle near-horizon Hawking thermal glow
      col = vec3(0.004, 0.007, 0.012);
    } else if (hitBox) {
      // Reflective AdS conformal boundary CFT dome
      vec3 bDir = normalize(cos(phi) * wHat + sin(phi) * tHat);
      bDir = rotY(uOrbit * 0.6) * bDir;
      float freq = 8.0 + floor(cCharge / 15.0) * 2.0;
      float lat = abs(fract(asin(clamp(bDir.y, -1.0, 1.0)) * freq / PI) - 0.5);
      float lon = abs(fract(atan(bDir.z, bDir.x) * freq / PI) - 0.5);
      float cftGrid = smoothstep(0.055, 0.0, min(lat, lon));
      float modes = 0.5 + 0.5 * sin(bDir.x * freq * 0.8 + uTime * 1.1) * cos(bDir.z * freq * 0.8 - uTime * 0.9);
      col = vec3(0.025, 0.095, 0.175);
      col += vec3(0.18, 0.78, 0.96) * cftGrid * (0.35 + 0.35 * modes);
      col += vec3(0.35, 0.62, 0.98) * pow(modes, 3.0) * 0.16;
      if (gridOn > 0.5) {
        col += vec3(0.6, 0.92, 1.0) * cftGrid * 0.25;
      }
    }

    // Photon ring around shadow boundary b ~ 1
    float shadowEdge = exp(-pow((b - 1.0) / 0.11, 2.0));
    col += vec3(0.98, 0.80, 0.45) * shadowEdge * 0.52;
    col += diskAccum;
    return col;
  }

  // Mode 3b: Static de Sitter (Lambda > 0) Cosmological Horizon surrounding observer
  vec3 traceDeSitterSky(vec3 rayDir, vec3 wHat, float gridOn) {
    vec3 d = rotY(uOrbit * 0.5) * normalize(rayDir);
    // Observer near origin looking out toward cosmic horizon r = l_dS
    float horizonWaves = fbm3(d * 5.0 + vec3(uTime * 0.12, -uTime * 0.08, 0.0));
    float horizonGlow = 0.45 + 0.55 * horizonWaves;

    vec3 col = sampleUniverseA(d, gridOn) * 0.55;
    // All-sky Gibbons-Hawking redshifted cosmological horizon veil
    float radialVeil = pow(0.65 + 0.35 * abs(dot(d, wHat)), 1.4);
    col += vec3(0.45, 0.24, 0.52) * horizonGlow * radialVeil * 0.52;
    col += vec3(0.28, 0.72, 0.92) * smoothstep(0.62, 0.92, horizonWaves) * 0.32;
    return col;
  }

  void main() {
    vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
    vec2 ndc = (vUv - 0.5) * 2.0 * aspect;

    // Camera local basis: looks toward -Z in camera frame, rotated by yaw/pitch
    float focal = 1.45;
    vec3 camRay = normalize(vec3(ndc.x, ndc.y, -focal));
    mat3 lookMat = rotY(uYaw) * rotX(uPitch);
    vec3 rayDir = normalize(lookMat * camRay);

    // +ell axis points away from throat (+Z), so looking at -Z looks directly into the throat
    vec3 wHat = vec3(0.0, 0.0, 1.0);
    vec3 col = vec3(0.0);

    if (uRegime == 0) {
      col = traceWormholeSky(rayDir, wHat, uRho, uHalfLen, uLensW, uEll0, 0.0, uShowGrid, 0.0);
    } else if (uRegime == 1) {
      // Euclidean WKB pinch-off: throat contracts & baby universe bubble detaches along throat axis
      float effRho = max(0.24, uRho * (1.0 - 0.76 * uPinch));
      col = traceWormholeSky(rayDir, wHat, effRho, uHalfLen * (1.0 - uPinch), uLensW, max(uEll0, 3.6), 0.0, uShowGrid, uPinch);
      // Overlay nucleating closed baby-universe sphere drifting away from pinched neck
      vec3 bubbleCenter = vec3(0.0, 0.75 * uPinch + 0.12 * sin(uTime * 1.4), -0.6 - 1.2 * uPinch);
      float bubbleR = 0.22 + 0.24 * exp(-0.22 * uAction);
      float bProj = dot(rayDir, normalize(bubbleCenter));
      float distToCenter = length(bubbleCenter);
      float sinAng = sqrt(max(0.0, 1.0 - bProj * bProj));
      if (bProj > 0.0 && distToCenter * sinAng < bubbleR) {
        float rim = smoothstep(0.0, bubbleR, distToCenter * sinAng);
        float wkbGlow = clamp(0.25 + 0.95 * exp(-0.35 * uAction), 0.15, 1.0);
        vec3 babyCol = mix(vec3(0.98, 0.76, 0.30), vec3(0.45, 0.88, 1.0), rim * 0.65);
        col = mix(col, babyCol * wkbGlow, 0.82);
      }
    } else if (uRegime == 2) {
      col = traceAdSBlackHole(rayDir, wHat, uRPlus, uCentralC, uShowGrid);
    } else {
      if (uDeSitterMode > 0.5) {
        col = traceDeSitterSky(rayDir, wHat, uShowGrid);
      } else {
        float fluc = uEnsembleOn > 0.5 ? sin(uTime * 3.1) * abs(uShift) * 0.85 : uShift;
        float effRho = max(0.55, uRho + fluc * 0.35);
        col = traceWormholeSky(rayDir, wHat, effRho, uHalfLen, uLensW, uEll0, fluc, uShowGrid, 0.0);
      }
    }

    // Subtle filmic tone mapping & vignette
    col = col / (1.0 + col * 0.35);
    col = pow(max(col, vec3(0.0)), vec3(0.92));
    float vig = 1.0 - 0.18 * dot(vUv - 0.5, vUv - 0.5);
    col *= vig;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function WormholeObserver({
  regime,
  onRegimeChange,
  action,
  centralCharge,
  energyRatio,
  spread,
  fixed,
  sector,
}: WormholeObserverProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");

  // Physical observer & wormhole geometry parameters
  const [ell0, setEll0] = useState(4.6);
  const [rho, setRho] = useState(1.15);
  const [lensingWidth, setLensingWidth] = useState(0.75);
  const [yaw, setYaw] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [orbiting, setOrbiting] = useState(false);
  const [flying, setFlying] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showGeodesics, setShowGeodesics] = useState(true);
  const [deSitterView, setDeSitterView] = useState(false);

  const dragRef = useRef<{ active: boolean; x: number; y: number; yaw0: number; pitch0: number }>({
    active: false,
    x: 0,
    y: 0,
    yaw0: 0,
    pitch0: 0,
  });

  // Derived numerical values from wormholeModels.ts
  const bounce = useMemo(() => solveEuclideanBounce(Math.max(0.1, action * 0.5), 1.5), [action]);
  const rPlus = useMemo(() => Math.sqrt(12 * energyRatio) * 0.45, [energyRatio]);
  const shiftInfo = useMemo(
    () => ensembleOpticalShift(spread, centralCharge, sector),
    [spread, centralCharge, sector]
  );

  // Live 2D RK4 Geodesic Cross-Section Rays (computed in TypeScript!)
  const rayBundle = useMemo(() => {
    if (regime === "ads_btz") {
      const r0 = Math.max(rPlus + 1.9, 4.4);
      const angles = [-2.55, -2.15, -1.75, -1.35, -0.95, -0.55, 0.55, 0.95, 1.35, 1.75, 2.15, 2.55];
      return {
        kind: "btz" as const,
        r0,
        rPlus,
        rays: angles.map((a) => ({
          angle: a,
          sign: Math.sign(a),
          trace: traceBtzGeodesic({
            r0,
            thetaFromOutward: Math.PI - Math.abs(a),
            rPlus,
            boxRadius: 9.5,
          }),
        })),
      };
    }

    const activeRho = regime === "euclidean" ? Math.max(0.24, rho * (1 - 0.76 * bounce.pinchFactor)) : rho;
    const activeEll = regime === "euclidean" ? Math.max(ell0, 3.6) : ell0;
    const critAngle = wormholeApparentAngle(activeEll, activeRho, 0.25, lensingWidth);
    const offsets = [-1.75, -1.35, -1.06, -0.75, -0.4, 0, 0.4, 0.75, 1.06, 1.35, 1.75];
    const dirBase = activeEll >= 0 ? Math.PI : 0;

    return {
      kind: "wormhole" as const,
      ell0: activeEll,
      rho: activeRho,
      critAngleDeg: (critAngle * 180) / Math.PI,
      r0: dnegRadius(activeEll, activeRho, 0.25, lensingWidth),
      rays: offsets.map((k) => {
        const theta = dirBase + k * critAngle;
        return {
          k,
          sign: k >= 0 ? 1 : -1,
          trace: traceWormholeGeodesic({
            ell0: activeEll,
            angleFromPlusEll: Math.abs(theta),
            rho: activeRho,
            throatHalfLen: 0.25,
            lensingWidth,
            skyRadius: 11,
          }),
        };
      }),
    };
  }, [regime, ell0, rho, lensingWidth, bounce.pinchFactor, rPlus]);

  // Ref holding live shader uniforms for rAF loop
  const uniformStateRef = useRef({
    regime,
    ell0,
    rho,
    lensingWidth,
    yaw,
    pitch,
    orbiting,
    flying,
    showGrid,
    action,
    pinch: bounce.pinchFactor,
    rPlus,
    centralCharge,
    shift: shiftInfo.effectiveShift,
    fixed,
    deSitterView,
  });

  uniformStateRef.current = {
    regime,
    ell0,
    rho,
    lensingWidth,
    yaw,
    pitch,
    orbiting,
    flying,
    showGrid,
    action,
    pinch: bounce.pinchFactor,
    rPlus,
    centralCharge,
    shift: shiftInfo.effectiveShift,
    fixed,
    deSitterView,
  };

  // Fly-through animation loop (updates ell0 smoothly across the throat ell=0)
  useEffect(() => {
    if (!flying) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFlying(false);
      return;
    }
    let raf = 0;
    let last = performance.now();
    const targetSign = ell0 >= 0 ? -1 : 1;
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setEll0((prev) => {
        const next = prev + targetSign * dt * 1.9;
        if ((targetSign < 0 && next <= -6.2) || (targetSign > 0 && next >= 6.2)) {
          setFlying(false);
          return targetSign < 0 ? -6.2 : 6.2;
        }
        return next;
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [flying]); // eslint-disable-line react-hooks/exhaustive-deps

  // Three.js WebGL Ray-Tracer lifecycle
  useEffect(() => {
    const container = hostRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    } catch {
      setStatus("fallback");
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.domElement.setAttribute(
      "aria-label",
      "Interactive relativistic ray-traced wormhole observer view; drag to look around, or use the flight slider and numerical ray diagram below"
    );
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms: Record<string, THREE.IUniform> = {
      uResolution: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uRegime: { value: 0 },
      uEll0: { value: 4.6 },
      uRho: { value: 1.15 },
      uHalfLen: { value: 0.25 },
      uLensW: { value: 0.75 },
      uYaw: { value: 0 },
      uPitch: { value: 0 },
      uOrbit: { value: 0 },
      uShowGrid: { value: 0 },
      uAction: { value: 2 },
      uPinch: { value: 0.5 },
      uRPlus: { value: 2.2 },
      uCentralC: { value: 60 },
      uShift: { value: 0 },
      uEnsembleOn: { value: 1 },
      uDeSitterMode: { value: 0 },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      depthTest: false,
      depthWrite: false,
    });
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    let frame = 0;
    let inView = true;
    let contextLost = false;
    let simTime = 0;
    let orbitAngle = 0;
    let lastTs = performance.now();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const regimeToInt = (r: ObserverRegime) =>
      r === "lorentzian" ? 0 : r === "euclidean" ? 1 : r === "ads_btz" ? 2 : 3;

    const renderFrame = (now: number) => {
      frame = 0;
      if (contextLost || document.hidden || !inView) return;
      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;
      const st = uniformStateRef.current;

      if (!reducedMotion.matches) {
        simTime += dt;
        if (st.orbiting) orbitAngle += dt * 0.25;
      }

      uniforms.uTime.value = simTime;
      uniforms.uRegime.value = regimeToInt(st.regime);
      uniforms.uEll0.value = st.ell0;
      uniforms.uRho.value = st.rho;
      uniforms.uLensW.value = st.lensingWidth;
      uniforms.uYaw.value = st.yaw;
      uniforms.uPitch.value = st.pitch;
      uniforms.uOrbit.value = orbitAngle;
      uniforms.uShowGrid.value = st.showGrid ? 1 : 0;
      uniforms.uAction.value = st.action;
      uniforms.uPinch.value = st.pinch;
      uniforms.uRPlus.value = st.rPlus;
      uniforms.uCentralC.value = st.centralCharge;
      uniforms.uShift.value = st.shift;
      uniforms.uEnsembleOn.value = st.fixed ? 0 : 1;
      uniforms.uDeSitterMode.value = st.deSitterView ? 1 : 0;

      renderer.render(scene, camera);
      frame = requestAnimationFrame(renderFrame);
    };

    const schedule = () => {
      if (!frame && !contextLost && !document.hidden && inView) {
        lastTs = performance.now();
        frame = requestAnimationFrame(renderFrame);
      }
    };

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h, false);
      const pr = renderer.getPixelRatio();
      uniforms.uResolution.value.set(Math.max(1, w * pr), Math.max(1, h * pr));
      schedule();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) schedule();
      else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    visibility.observe(container);

    const loseContext = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      cancelAnimationFrame(frame);
      frame = 0;
      setStatus("fallback");
    };
    renderer.domElement.addEventListener("webglcontextlost", loseContext);
    document.addEventListener("visibilitychange", schedule);

    resize();
    setStatus("ready");

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", schedule);
      renderer.domElement.removeEventListener("webglcontextlost", loseContext);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  const crossingCount =
    rayBundle.kind === "wormhole"
      ? rayBundle.rays.filter((r) => r.trace.crossed).length
      : rayBundle.rays.filter((r) => r.trace.captured).length;

  return (
    <div className="wh-observer-shell">
      <div className="wh-observer-tabs" role="tablist" aria-label="Observer physical regime">
        <button
          role="tab"
          aria-selected={regime === "lorentzian"}
          onClick={() => onRegimeChange("lorentzian")}
        >
          <span>01 · Observer view</span>
          <strong>Lorentzian wormhole</strong>
        </button>
        <button
          role="tab"
          aria-selected={regime === "euclidean"}
          onClick={() => onRegimeChange("euclidean")}
        >
          <span>02 · WKB instanton</span>
          <strong>Euclidean pinch-off</strong>
        </button>
        <button
          role="tab"
          aria-selected={regime === "ads_btz"}
          onClick={() => onRegimeChange("ads_btz")}
        >
          <span>03 · Cardy = Area/4G</span>
          <strong>AdS₃ black hole box</strong>
        </button>
        <button
          role="tab"
          aria-selected={regime === "ensemble_ds"}
          onClick={() => onRegimeChange("ensemble_ds")}
        >
          <span>04 · Statistics &amp; Λ&gt;0</span>
          <strong>Ensemble &amp; de Sitter</strong>
        </button>
      </div>

      <div
        className="wh-observer-stage"
        onPointerDown={(e) => {
          dragRef.current = {
            active: true,
            x: e.clientX,
            y: e.clientY,
            yaw0: yaw,
            pitch0: pitch,
          };
        }}
        onPointerMove={(e) => {
          if (!dragRef.current.active) return;
          const dx = e.clientX - dragRef.current.x;
          const dy = e.clientY - dragRef.current.y;
          setYaw(dragRef.current.yaw0 - dx * 0.0055);
          setPitch(Math.max(-1.25, Math.min(1.25, dragRef.current.pitch0 - dy * 0.0045)));
        }}
        onPointerUp={() => {
          dragRef.current.active = false;
        }}
        onPointerLeave={() => {
          dragRef.current.active = false;
        }}
      >
        <div className="wh-observer-gl" ref={hostRef} hidden={status === "fallback"} />

        {status !== "ready" && (
          <div className="wh-fallback" role="status">
            <p>
              {status === "loading"
                ? "Initialising relativistic RK4 geodesic shader…"
                : "WebGL is unavailable; the numerical RK4 geodesic cross-section and analytical experiments below remain active."}
            </p>
          </div>
        )}

        <div className="wh-observer-hud-top" aria-hidden="true">
          <span className="wh-hud-badge">
            {regime === "lorentzian" && `Side ${ell0 >= 0 ? "A (ℓ > 0)" : "B (ℓ < 0)"} · ℓ = ${ell0.toFixed(2)} ρ`}
            {regime === "euclidean" && `Euclidean WKB · e^(−ΔI/ħ) = ${Math.exp(-action).toFixed(4)}`}
            {regime === "ads_btz" && `Inside AdS₃ Box · r₊/ℓ = ${rPlus.toFixed(2)} · c = ${centralCharge}`}
            {regime === "ensemble_ds" &&
              (deSitterView
                ? "Static de Sitter Patch · Cosmic horizon"
                : `${fixed ? "Fixed α sector" : "Ensemble fluctuations"} · c = ${centralCharge}`)}
          </span>
          <div className="wh-hud-legend">
            <span>
              <i style={{ background: "#65d9ed" }} />
              {regime === "ads_btz" ? "AdS CFT box" : "Universe A"}
            </span>
            <span>
              <i style={{ background: "#f5b971" }} />
              {regime === "ads_btz" ? "Horizon ring" : "Universe B"}
            </span>
          </div>
        </div>

        <div className="wh-observer-hud-bottom">
          <span>Drag to look around · Use flight controls below to cross the throat</span>
          <div className="wh-hud-actions">
            {regime === "lorentzian" && (
              <button
                type="button"
                className="wh-hud-primary"
                onClick={() => setFlying((f) => !f)}
              >
                {flying ? "Pause flight" : ell0 >= 0 ? "Fly through throat →" : "← Fly back to Side A"}
              </button>
            )}
            {regime === "ensemble_ds" && (
              <button
                type="button"
                className="wh-hud-primary"
                onClick={() => setDeSitterView((v) => !v)}
              >
                {deSitterView ? "Switch to ensemble throat" : "Switch to de Sitter horizon"}
              </button>
            )}
            <button
              type="button"
              aria-pressed={showGrid}
              onClick={() => setShowGrid((g) => !g)}
            >
              {showGrid ? "Hide sky grid" : "Show sky grid"}
            </button>
            <button
              type="button"
              aria-pressed={orbiting}
              onClick={() => setOrbiting((o) => !o)}
            >
              {orbiting ? "Stop drift" : "Drift sky"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFlying(false);
                setEll0(4.6);
                setYaw(0);
                setPitch(0);
              }}
            >
              Reset view
            </button>
          </div>
        </div>
      </div>

      {/* Flight & Metric Control Strip + Live Numerical Geodesic Cross-Section */}
      <div className="wh-observer-deck">
        <div className="wh-observer-controls">
          <div className="wh-range">
            <label htmlFor="wh-obs-ell">
              Observer proper distance ℓ / ρ
              <output htmlFor="wh-obs-ell">{ell0.toFixed(2)}</output>
            </label>
            <input
              id="wh-obs-ell"
              type="range"
              min={-7}
              max={7}
              step={0.05}
              value={ell0}
              onChange={(e) => {
                setFlying(false);
                setEll0(Number(e.target.value));
              }}
            />
          </div>

          <div className="wh-range">
            <label htmlFor="wh-obs-rho">
              Throat radius ρ (arbitrary units)
              <output htmlFor="wh-obs-rho">{rho.toFixed(2)}</output>
            </label>
            <input
              id="wh-obs-rho"
              type="range"
              min={0.5}
              max={2.0}
              step={0.05}
              value={rho}
              onChange={(e) => setRho(Number(e.target.value))}
            />
          </div>

          <div className="wh-range">
            <label htmlFor="wh-obs-w">
              Lensing transition width W
              <output htmlFor="wh-obs-w">{lensingWidth.toFixed(2)}</output>
            </label>
            <input
              id="wh-obs-w"
              type="range"
              min={0.15}
              max={1.8}
              step={0.05}
              value={lensingWidth}
              onChange={(e) => setLensingWidth(Number(e.target.value))}
            />
          </div>

          <div className="wh-observer-note">
            {regime === "lorentzian" && (
              <p>
                <strong>What you are experiencing:</strong> real-time GPU 4th-order Runge–Kutta
                null geodesic integration through the smooth Morris–Thorne / DNEG throat metric.
                Rays with impact parameter <code>b &lt; ρ</code> pass from Universe A (cyan)
                through the throat into Universe B (amber); grazing rays orbit near{" "}
                <code>b ≈ ρ</code> to form the Einstein ring.
              </p>
            )}
            {regime === "euclidean" && (
              <p>
                <strong>Why you cannot fly through a Euclidean wormhole:</strong> rotating to
                Euclidean time turns the throat into a tunnelling instanton with WKB weight{" "}
                <code>e^(−ΔI/ħ) = {Math.exp(-action).toFixed(4)}</code>. Instead of carrying a
                spacecraft between two skies, the neck pinches off and nucleates a closed{" "}
                <em>baby universe</em>, shifting effective couplings in the parent universe.
              </p>
            )}
            {regime === "ads_btz" && (
              <p>
                <strong>Inside the AdS₃ box:</strong> your camera orbits inside a reflective
                anti-de Sitter boundary shell around a non-rotating BTZ horizon of radius{" "}
                <code>r₊/ℓ = {rPlus.toFixed(2)}</code>. Outward rays bounce off the holographic
                CFT dome while inward rays fall inside the horizon shadow—visually pairing the
                Cardy boundary density with horizon area.
              </p>
            )}
            {regime === "ensemble_ds" && (
              <p>
                {deSitterView ? (
                  <>
                    <strong>The open Λ &gt; 0 frontier:</strong> unlike an AdS box with a cold outer
                    boundary, an accelerating de Sitter observer sits inside a glowing cosmological
                    horizon on every side. How holographic ensembles extend here remains open.
                  </>
                ) : (
                  <>
                    <strong>Seeing statistical couplings:</strong> with{" "}
                    {fixed
                      ? "a fixed α sector, the wormhole lensing stays crisp and deterministic."
                      : `ensemble averaging active at c = ${centralCharge}, α-sector fluctuations shift the throat coupling by ~${Math.abs(
                          shiftInfo.effectiveShift
                        ).toFixed(3)} — small at large c, yet non-zero.`}
                  </>
                )}
              </p>
            )}
          </div>
        </div>

        <div className="wh-geodesic-panel">
          <div className="wh-geodesic-head">
            <span>Numerical RK4 Geodesic Cross-Section</span>
            <button
              type="button"
              className="wh-mini-btn"
              onClick={() => setShowGeodesics((v) => !v)}
            >
              {showGeodesics ? "Hide numbers" : "Show numbers"}
            </button>
          </div>

          <svg
            className="wh-geodesic-svg"
            viewBox="-12 -6.5 24 13"
            role="img"
            aria-label="Two-dimensional cross-section of numerically integrated null geodesics"
          >
            {rayBundle.kind === "wormhole" ? (
              <>
                <defs>
                  <clipPath id="wh-clip-a">
                    <circle cx={0} cy={0} r={5.35} />
                  </clipPath>
                  <clipPath id="wh-clip-b">
                    <circle cx={0} cy={0} r={5.35} />
                  </clipPath>
                </defs>
                {/* Left disc: Universe A (ell >= 0), Right disc: Universe B (ell < 0) */}
                <g transform="translate(-5.8, 0)">
                  <circle cx={0} cy={0} r={5.4} fill="#071726" stroke="#1f4159" strokeWidth={0.07} />
                  <g clipPath="url(#wh-clip-a)">
                    <circle
                      cx={0}
                      cy={0}
                      r={Math.min(2.6, rayBundle.rho * 0.9)}
                      fill="#040d16"
                      stroke="#65d9ed"
                      strokeWidth={0.08}
                      strokeDasharray="0.22 0.14"
                    />
                    {rayBundle.rays.map((ray, idx) => {
                      const scale = 0.55;
                      const sideA = ray.trace.points.filter((p) => p.ell >= 0);
                      if (sideA.length < 2) return null;
                      const d = sideA
                        .map((p, i) => {
                          const px = p.x * scale;
                          const py = ray.sign * p.y * scale;
                          return `${i === 0 ? "M" : "L"}${px.toFixed(2)},${py.toFixed(2)}`;
                        })
                        .join(" ");
                      return (
                        <path
                          key={idx}
                          d={d}
                          fill="none"
                          stroke={ray.trace.crossed ? "#f5b971" : "#5bd6ec"}
                          strokeWidth={Math.abs(ray.k) === 1.06 ? 0.12 : 0.08}
                          opacity={0.85}
                        />
                      );
                    })}
                    {rayBundle.ell0 >= 0 && (
                      <circle
                        cx={Math.max(-5, Math.min(5, rayBundle.r0 * 0.55))}
                        cy={0}
                        r={0.22}
                        fill="#ffffff"
                      />
                    )}
                  </g>
                  <text x={0} y={-4.65} textAnchor="middle" fontSize={0.58} fill="#7dd3fc">
                    Universe A (ℓ &gt; 0)
                  </text>
                </g>

                <g transform="translate(5.8, 0)">
                  <circle cx={0} cy={0} r={5.4} fill="#120c14" stroke="#4d3228" strokeWidth={0.07} />
                  <g clipPath="url(#wh-clip-b)">
                    <circle
                      cx={0}
                      cy={0}
                      r={Math.min(2.6, rayBundle.rho * 0.9)}
                      fill="#040d16"
                      stroke="#f5b971"
                      strokeWidth={0.08}
                      strokeDasharray="0.22 0.14"
                    />
                    {rayBundle.rays.map((ray, idx) => {
                      const scale = 0.55;
                      const sideB = ray.trace.points.filter((p) => p.ell < 0);
                      if (sideB.length < 2) return null;
                      const d = sideB
                        .map((p, i) => {
                          const px = -p.x * scale;
                          const py = ray.sign * p.y * scale;
                          return `${i === 0 ? "M" : "L"}${px.toFixed(2)},${py.toFixed(2)}`;
                        })
                        .join(" ");
                      return (
                        <path
                          key={idx}
                          d={d}
                          fill="none"
                          stroke="#f5b971"
                          strokeWidth={0.09}
                          opacity={0.9}
                        />
                      );
                    })}
                    {rayBundle.ell0 < 0 && (
                      <circle
                        cx={Math.max(-5, Math.min(5, -rayBundle.r0 * 0.55))}
                        cy={0}
                        r={0.22}
                        fill="#ffffff"
                      />
                    )}
                  </g>
                  <text x={0} y={-4.65} textAnchor="middle" fontSize={0.58} fill="#fcd34d">
                    Universe B (ℓ &lt; 0)
                  </text>
                </g>
              </>
            ) : (
              <g transform="translate(0, 0)">
                <circle cx={0} cy={0} r={5.6} fill="#071726" stroke="#4cc9ed" strokeWidth={0.1} />
                <circle
                  cx={0}
                  cy={0}
                  r={Math.min(3.5, rayBundle.rPlus * 0.56)}
                  fill="#02050a"
                  stroke="#f5b971"
                  strokeWidth={0.09}
                />
                <text x={0} y={-4.85} textAnchor="middle" fontSize={0.56} fill="#7dd3fc">
                  AdS₃ Conformal Boundary Box (r_box = 9.5)
                </text>
                {rayBundle.rays.map((ray, idx) => {
                  const scale = 0.56;
                  const d = ray.trace.points
                    .map((p, i) => {
                      const px = p.x * scale;
                      const py = ray.sign * p.y * scale;
                      return `${i === 0 ? "M" : "L"}${px.toFixed(2)},${py.toFixed(2)}`;
                    })
                    .join(" ");
                  return (
                    <path
                      key={idx}
                      d={d}
                      fill="none"
                      stroke={ray.trace.captured ? "#f5b971" : "#5bd6ec"}
                      strokeWidth={0.08}
                      opacity={0.85}
                    />
                  );
                })}
                <circle cx={rayBundle.r0 * 0.56} cy={0} r={0.22} fill="#ffffff" />
              </g>
            )}
          </svg>

          {showGeodesics && (
            <div className="wh-geodesic-stats">
              {rayBundle.kind === "wormhole" ? (
                <>
                  <span>Throat ring θ ≈ {rayBundle.critAngleDeg.toFixed(1)}°</span>
                  <span>
                    Crossed throat: {crossingCount}/{rayBundle.rays.length} rays
                  </span>
                </>
              ) : (
                <>
                  <span>BTZ horizon r₊/ℓ = {rayBundle.rPlus.toFixed(2)}</span>
                  <span>
                    Horizon captured: {crossingCount}/{rayBundle.rays.length} rays
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
