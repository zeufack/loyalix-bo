import { Icon } from './icon';

export interface EventType {
  id: string;
  name: string;
  description: string;
  icon?: Icon | null;
}
