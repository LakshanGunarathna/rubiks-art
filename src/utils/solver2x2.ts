let perm: number[] = [];
let twst: number[] = [];
let permmv: number[][] = [];
let twstmv: number[][] = [];
let isInitialized = false;
let sol: number[] = [];

// Core piece map from the original logic
const piece = [
  15, 16, 16, 21, 21, 15, 13, 9, 9, 17, 17, 13, 14, 20, 20, 4, 4, 14, 12, 5, 5, 8, 8, 12,
  3, 23, 23, 18, 18, 3, 1, 19, 19, 11, 11, 1, 2, 6, 6, 22, 22, 2, 0, 10, 10, 7, 7, 0
];

function getprmmv(p: number, m: number): number {
  let a: number, b: number, c: number, q: number;
  const ps: number[] = new Array(8);
  q = p;
  for (a = 1; a <= 7; a++) {
    b = q % a;
    q = Math.floor((q - b) / a);
    for (c = a - 1; c >= b; c--) {
      ps[c + 1] = ps[c];
    }
    ps[b] = 7 - a;
  }
  if (m === 0) {
    c = ps[0]; ps[0] = ps[1]; ps[1] = ps[3]; ps[3] = ps[2]; ps[2] = c;
  } else if (m === 1) {
    c = ps[0]; ps[0] = ps[4]; ps[4] = ps[5]; ps[5] = ps[1]; ps[1] = c;
  } else if (m === 2) {
    c = ps[0]; ps[0] = ps[2]; ps[2] = ps[6]; ps[6] = ps[4]; ps[4] = c;
  }
  q = 0;
  for (a = 0; a < 7; a++) {
    b = 0;
    for (c = 0; c < 7; c++) {
      if (ps[c] === a) break;
      if (ps[c] > a) b++;
    }
    q = q * (7 - a) + b;
  }
  return q;
}

function gettwsmv(p: number, m: number): number {
  let a: number, b: number, c: number, d: number, q: number;
  const ps: number[] = new Array(7);
  q = p;
  d = 0;
  for (a = 0; a <= 5; a++) {
    c = Math.floor(q / 3);
    b = q - 3 * c;
    q = c;
    ps[a] = b;
    d -= b;
    if (d < 0) d += 3;
  }
  ps[6] = d;
  if (m === 0) {
    c = ps[0]; ps[0] = ps[1]; ps[1] = ps[3]; ps[3] = ps[2]; ps[2] = c;
  } else if (m === 1) {
    c = ps[0]; ps[0] = ps[4]; ps[4] = ps[5]; ps[5] = ps[1]; ps[1] = c;
    ps[0] += 2; ps[1]++; ps[5] += 2; ps[4]++;
  } else if (m === 2) {
    c = ps[0]; ps[0] = ps[2]; ps[2] = ps[6]; ps[6] = ps[4]; ps[4] = c;
    ps[2] += 2; ps[0]++; ps[4] += 2; ps[6]++;
  }
  q = 0;
  for (a = 5; a >= 0; a--) {
    q = q * 3 + (ps[a] % 3);
  }
  return q;
}

export function init(): void {
  if (isInitialized) return;

  perm = new Array(5040).fill(-1);
  permmv = Array.from({ length: 5040 }, () => new Array(3));
  for (let p = 0; p < 5040; p++) {
    for (let m = 0; m < 3; m++) {
      permmv[p][m] = getprmmv(p, m);
    }
  }

  perm[0] = 0;
  for (let l = 0; l <= 6; l++) {
    for (let p = 0; p < 5040; p++) {
      if (perm[p] === l) {
        for (let m = 0; m < 3; m++) {
          let q = p;
          for (let c = 0; c < 3; c++) {
            q = permmv[q][m];
            if (perm[q] === -1) perm[q] = l + 1;
          }
        }
      }
    }
  }

  twst = new Array(729).fill(-1);
  twstmv = Array.from({ length: 729 }, () => new Array(3));
  for (let p = 0; p < 729; p++) {
    for (let m = 0; m < 3; m++) {
      twstmv[p][m] = gettwsmv(p, m);
    }
  }

  twst[0] = 0;
  for (let l = 0; l <= 5; l++) {
    for (let p = 0; p < 729; p++) {
      if (twst[p] === l) {
        for (let m = 0; m < 3; m++) {
          let q = p;
          for (let c = 0; c < 3; c++) {
            q = twstmv[q][m];
            if (twst[q] === -1) twst[q] = l + 1;
          }
        }
      }
    }
  }

  isInitialized = true;
}

function search(d: number, q: number, t: number, l: number, lm: number): boolean {
  if (l === 0) {
    if (q === 0 && t === 0) return true;
  } else {
    if (perm[q] > l || twst[t] > l) return false;
    for (let m = 0; m < 3; m++) {
      if (m !== lm) {
        let p = q;
        let s = t;
        for (let a = 0; a < 3; a++) {
          p = permmv[p][m];
          s = twstmv[s][m];
          sol[d] = 10 * m + a;
          if (search(d + 1, p, s, l - 1, m)) return true;
        }
      }
    }
  }
  return false;
}

export function solve(posit: number[]): string[] | string {
  if (posit.length !== 24) return "Error: Cube state must contain exactly 24 facelets.";

  init();

  const adj: number[][] = Array.from({ length: 6 }, () => new Array(6).fill(0));

  // Count adjacent pairs
  for (let a = 0; a < 48; a += 2) {
    if (posit[piece[a]] <= 5 && posit[piece[a + 1]] <= 5) {
      adj[posit[piece[a]]][posit[piece[a + 1]]]++;
    }
  }

  const opp: number[] = new Array(6);
  for (let a = 0; a < 6; a++) {
    for (let b = 0; b < 6; b++) {
      if (a !== b && adj[a][b] + adj[b][a] === 0) {
        opp[a] = b;
        opp[b] = a;
      }
    }
  }

  const ps: number[] = [];
  const tws: number[] = [];
  let aIndex = 0;
  for (let d = 0; d < 7; d++) {
    let p = 0;
    for (let b = aIndex; b < aIndex + 6; b += 2) {
      if (posit[piece[b]] === posit[piece[42]]) p += 4;
      if (posit[piece[b]] === posit[piece[44]]) p += 1;
      if (posit[piece[b]] === posit[piece[46]]) p += 2;
    }
    ps[d] = p;
    if (posit[piece[aIndex]] === posit[piece[42]] || posit[piece[aIndex]] === opp[posit[piece[42]]]) {
      tws[d] = 0;
    } else if (posit[piece[aIndex + 2]] === posit[piece[42]] || posit[piece[aIndex + 2]] === opp[posit[piece[42]]]) {
      tws[d] = 1;
    } else {
      tws[d] = 2;
    }
    aIndex += 6;
  }

  let q = 0;
  for (let a = 0; a < 7; a++) {
    let b = 0;
    for (let c = 0; c < 7; c++) {
      if (ps[c] === a) break;
      if (ps[c] > a) b++;
    }
    q = q * (7 - a) + b;
  }

  let t = 0;
  for (let a = 5; a >= 0; a--) {
    t = t * 3 + tws[a] - 3 * Math.floor(tws[a] / 3);
  }

  if (q === 0 && t === 0) return []; // Already solved

  sol = [];
  let found = false;
  for (let l = 0; l <= 11; l++) {
    if (search(0, q, t, l, -1)) {
      found = true;
      break;
    }
  }

  if (!found) return "Error: Unsolvable cube state.";

  const moveList: string[] = [];
  for (let i = 0; i < sol.length; i++) {
    const move = "URF".charAt(Math.floor(sol[i] / 10));
    const suffix = " 2'".charAt(sol[i] % 10).trim();
    moveList.push(move + suffix);
  }

  return moveList;
}
