export interface UseCase<P, R> {
  run(param: P): Promise<R>;
}
