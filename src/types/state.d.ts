import type Broker from '../broker';

export interface IState {
  broker: Broker;
}

export interface IConfigInterface {
  amqpURI: string;
  mongoURI: string;
}
