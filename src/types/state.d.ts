import type Broker from '../broker';

export interface IState {
  Broker: Broker;
}

export interface IConfigInterface {
  amqpURI: string;
  mongoURI: string;
}
