import { Icon } from './icon';

export interface RewardType {
  id: string;
  name: string;
  description: string | null;
  icon?: Icon | null;
}
