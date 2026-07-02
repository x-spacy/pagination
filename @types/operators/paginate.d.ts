import { Page } from '../schemas/Page';

export declare function paginate<T>(items: Array<T>, total: number, hasMore?: boolean | null): Page<T>;
