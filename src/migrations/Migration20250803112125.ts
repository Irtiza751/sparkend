import { Migration } from '@mikro-orm/migrations';

export class Migration20250803112125 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "user" alter column "vefified" type boolean using ("vefified"::boolean);`,
    );
    this.addSql(
      `alter table "user" alter column "vefified" set default false;`,
    );
    this.addSql(`alter table "user" alter column "vefified" drop not null;`);
    this.addSql(
      `alter table "user" alter column "is_active" type boolean using ("is_active"::boolean);`,
    );
    this.addSql(
      `alter table "user" alter column "is_active" set default true;`,
    );
    this.addSql(`alter table "user" alter column "is_active" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" alter column "vefified" drop default;`);
    this.addSql(
      `alter table "user" alter column "vefified" type boolean using ("vefified"::boolean);`,
    );
    this.addSql(`alter table "user" alter column "vefified" set not null;`);
    this.addSql(
      `alter table "user" alter column "is_active" type boolean using ("is_active"::boolean);`,
    );
    this.addSql(`alter table "user" alter column "is_active" set not null;`);
  }
}
