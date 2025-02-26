import { Endpoint } from "./api";

export class TestEndpoint extends Endpoint<
  { a:number, b:string }>{
    path: string = '/api';
    baseUrl? = 'http://localhost:3000';
    method?: "GET" | "POST" | undefined = 'GET';

    constructor() {
        super(undefined);
    }
  }

  export class TestEndpoint1 extends Endpoint<
  { a:number, b:string }, {query: {a:number}}>{
    path: string = '/echo1';
    baseUrl? = 'http://localhost:3000';
    method?: "GET" | "POST" | undefined = 'GET';

    constructor(bla: number) {
        super({query: {a: bla}});
    }
  }

