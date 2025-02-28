type endpointParams =
  | {
      query?: Record<string, any>;
      body?: Record<string, any>;
    }
  | undefined;

export abstract class Endpoint<
  TResponse,
  TParams extends endpointParams = undefined
> {
  abstract path: string;
  abstract baseUrl?: string;
  abstract method?: "GET" | "POST";
  static headers: Record<string, string> = {};
  static commonQueryparams: Record<string, string> = {};

  static setHeader(key: string, value: string) {
    this.headers[key] = value;
  }

  static setCommonQueryparams(key: string, value: string) {
    this.commonQueryparams[key] = value;
  }

  constructor(private params: TParams) {}

  async call(callBack?: (response: TResponse) => void): Promise<TResponse> {
    let url = (this.baseUrl || Api.globalBaseUrl) + this.path;

    let queryParams = { ...this.params?.query, ...Endpoint.commonQueryparams };
    if (queryParams) {
      const queryString = Object.entries(queryParams)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
        )
        .join("&");
      url += `?${queryString}`;
    }

    const response = await fetch(url, {
      method: this.method || "POST",
      body: this.params?.body ? JSON.stringify(this.params?.body) : undefined,
      headers: {
        ...Endpoint.headers,
        "Content-Type": "application/json",
      },
    });
    const data: TResponse = await response.json();
    if (callBack) {
      callBack(data);
    }
    return data;
  }
}

export class Api {
  static globalBaseUrl: string;
  static call<
    T extends Endpoint<any, any>,
    Args extends ConstructorParameters<new (...args: any[]) => T>
  >(ctor: new (...args: Args) => T, ...args: Args): ReturnType<T["call"]> {
    if (this.mocks[ctor.name])
      return this.mocks[ctor.name]() as ReturnType<T["call"]>;

    const instance = new ctor(...args);
    console.log(instance);
    return instance.call() as ReturnType<T["call"]>;
  }

  static setHeader(key: string, value: string) {
    Endpoint.setHeader(key, value);
  }

  static setCommonQueryparams(key: string, value: string) {
    Endpoint.setCommonQueryparams(key, value);
  }

  static mocks: Record<string, () => {}> = {};

  static mock<
    T extends Endpoint<any, any>,
    Args extends ConstructorParameters<new (...args: any[]) => T>
  >(
    ctor: new (...args: Args) => T,
    getDataCallBack: () => ReturnType<T["call"]>
  ): void {
    this.mocks[ctor.name] = getDataCallBack;
  }
}
