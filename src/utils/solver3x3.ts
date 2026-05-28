export async function solve(cubeString: string): Promise<string[]> {
  const { default: Cube } = await import('cubejs');
  Cube.initSolver();

  const cube = Cube.fromString(cubeString);
  const solution = cube.solve();
  
  return solution.split(' ').filter((m: string) => m);
}
