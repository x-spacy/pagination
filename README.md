# Pagination

A pagination library for NestJS with metadata and navigation links support.

## Installation

```bash
# Using npm
npm install @x-spacy/pagination

# Using yarn
yarn add @x-spacy/pagination

# Using pnpm
pnpm add @x-spacy/pagination

# Using bun
bun add @x-spacy/pagination
```

## Configuration

### Required: `reflect-metadata`

This library uses `class-transformer` for object serialization, which relies on **decorators** and **metadata reflection**. For the transformers to work correctly, it is **mandatory** to have `reflect-metadata` configured in your project.

#### 1. Install `reflect-metadata`

```bash
# Using npm
npm install reflect-metadata

# Using yarn
yarn add reflect-metadata

# Using pnpm
pnpm add reflect-metadata

# Using bun
bun add reflect-metadata
```

#### 2. Import in Entry Point

Add the `reflect-metadata` import in your application's entry file (`main.ts`) **before any other imports**:

```typescript
import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();
```

#### 3. Configure `tsconfig.json`

Make sure the following options are enabled in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Usage

### Basic Example

To use pagination, you need **two mandatory elements**:

1. **`PaginateInterceptor`**: Interceptor that processes the response and generates pagination metadata
2. **`paginate()`**: Function that wraps the data to be processed by the interceptor

```typescript
import { Controller, Get, HttpCode, HttpStatus, Query, UseInterceptors } from '@nestjs/common';

import { PaginateInterceptor, paginate } from '@x-spacy/pagination';

import { ListServicesService } from './list-services.service';
import { ListServicesHttpControllerQueryValidator } from './validators/list-services-http-controller-query.validator';
import { ServiceHttpControllerSerializer } from './serializers/service-http-controller.serializer';

@Controller('services')
export class ListServicesHttpController {
  @Inject('ListServicesService')
  private readonly listServicesService: ListServicesService

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(PaginateInterceptor)
  public async list(@Query() { page, perPage }: ListServicesHttpControllerQueryValidator) {
    const { services, total } = await this.listServicesService.execute(page, perPage);

    return paginate(services.map(service => ServiceHttpControllerSerializer.serialize(service)), total);
  }
}
```

### Query Parameters

The interceptor expects the following query parameters:

| Parameter | Type   | Default | Description                              |
|-----------|--------|---------|------------------------------------------|
| `page`    | number | 1       | Current page number                      |
| `perPage` | number | 10      | Number of items per page (max: 100)      |

## Pagination Strategies

The interceptor supports two strategies, selected explicitly when instantiated:
`OFFSET` (default) and `CURSOR`. The default `@UseInterceptors(PaginateInterceptor)`
uses `OFFSET` and is fully backward compatible.

### Cursor Pagination

Cursor pagination returns opaque, base64-encoded cursors derived from a field on your
items (e.g. `id`). Pass the strategy and the `cursorKey` to the interceptor:

```typescript
import { PaginateInterceptor, PaginationStrategyEnum, paginate } from '@x-spacy/pagination';

@Controller('services')
export class ListServicesHttpController {
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new PaginateInterceptor({
    strategy: PaginationStrategyEnum.CURSOR,
    cursorKey: 'id'
  }))
  public async list(@Query() { cursor, perPage }: ListServicesHttpControllerQueryValidator) {
    const { services, total } = await this.listServicesService.execute(cursor, perPage);

    return paginate(services.map(service => ServiceHttpControllerSerializer.serialize(service)), total);
  }
}
```

Your service decodes the incoming `cursor` (via `decodeCursor`) to resolve where to
continue the query from, and still returns the `total`. The interceptor builds the
`next`/`previous` cursors from the first and last items of the current page.

#### Cursor Query Parameters

| Parameter | Type   | Default | Description                                        |
|-----------|--------|---------|----------------------------------------------------|
| `cursor`  | string | —       | Opaque base64 cursor; omit for the first page      |
| `perPage` | number | 10      | Number of items per page (max: 100)                |

#### Cursor Response Structure

In cursor mode, `meta.from`, `meta.to` and `meta.current_page` are `null` (offsets are
not derivable from an opaque cursor), `last_page_url` is `null` (the last cursor is not
computable), and `meta.next_cursor`/`meta.previous_cursor` carry the cursors. The
`links` array contains `FIRST`, `PREVIOUS` and `NEXT` entries (no numbered page links).

```json
{
  "items": [...],
  "meta": {
    "from": null,
    "to": null,
    "current_page": null,
    "last_page": 9,
    "per_page": 3,
    "total": 25,
    "next_cursor": "MTM",
    "previous_cursor": null
  },
  "path": "https://api.example.com/services",
  "first_page_url": "https://api.example.com/services?perPage=3",
  "previous_page_url": null,
  "next_page_url": "https://api.example.com/services?cursor=MTM&perPage=3",
  "last_page_url": null,
  "links": [
    { "url": "https://api.example.com/services?perPage=3", "label": "First", "type": "FIRST", "active": false },
    { "url": null, "label": "« Previous", "type": "PREVIOUS", "active": false },
    { "url": "https://api.example.com/services?cursor=MTM&perPage=3", "label": "Next »", "type": "NEXT", "active": false }
  ]
}
```

#### Cursor Helpers

```typescript
import { encodeCursor, decodeCursor } from '@x-spacy/pagination';

const cursor = encodeCursor(42);   // 'NDI'
const value = decodeCursor(cursor); // '42'
```

## Response Structure

The paginated response follows this format:

```json
{
  "items": [...],
  "meta": {
    "from": 1,
    "to": 10,
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 50,
    "next_cursor": null,
    "previous_cursor": null
  },
  "path": "https://api.example.com/services",
  "first_page_url": "https://api.example.com/services?page=1&perPage=10",
  "prev_page_url": null,
  "next_page_url": "https://api.example.com/services?page=2&perPage=10",
  "last_page_url": "https://api.example.com/services?page=5&perPage=10",
  "links": [
    {
      "url": null,
      "label": "« Previous",
      "type": "PREVIOUS",
      "active": false
    },
    {
      "url": "https://api.example.com/services?page=1&perPage=10",
      "label": "1",
      "type": "PAGE",
      "active": true
    },
    {
      "url": "https://api.example.com/services?page=2&perPage=10",
      "label": "2",
      "type": "PAGE",
      "active": false
    },
    {
      "url": "https://api.example.com/services?page=2&perPage=10",
      "label": "Next »",
      "type": "NEXT",
      "active": false
    }
  ]
}
```

## API Reference

### `paginate<T>(items: Array<T>, total: number): Page<T>`

Wraps the items and total to be processed by `PaginateInterceptor`.

**Parameters:**

- `items`: Array of items for the current page
- `total`: Total number of items (used to calculate pagination)

**Returns:**

- `Page<T>`: Object that will be intercepted and transformed into `PaginatedResponse<T>`

### `PaginateInterceptor`

NestJS interceptor that transforms a `Page<T>` into a complete paginated response with metadata and navigation links.

### Exported Types

```typescript
// Enums
export { PaginationLinkTypeEnum } from '@x-spacy/pagination';

// Interceptors
export { PaginateInterceptor } from '@x-spacy/pagination';

// Operators
export { paginate } from '@x-spacy/pagination';
```

### `PaginationLinkTypeEnum`

Enum that defines the types of navigation links:

```typescript
enum PaginationLinkTypeEnum {
  FIRST = 'FIRST',
  LAST = 'LAST',
  PREVIOUS = 'PREVIOUS',
  NEXT = 'NEXT',
  PAGE = 'PAGE'
}
```

## License

[MIT licensed](LICENSE).
