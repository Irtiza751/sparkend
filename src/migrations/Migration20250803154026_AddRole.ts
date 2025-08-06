import { Migration } from '@mikro-orm/migrations';

export class Migration20250803154026_AddRole extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "role" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, constraint "role_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "role" add constraint "role_name_unique" unique ("name");`,
    );

    this.addSql(
      `create table "user_roles" ("user_id" uuid not null, "role_id" uuid not null, constraint "user_roles_pkey" primary key ("user_id", "role_id"));`,
    );

    this.addSql(
      `alter table "user_roles" add constraint "user_roles_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "user_roles" add constraint "user_roles_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;`,
    );

    this.addSql(`alter table "user" drop column "role";`);
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "user_roles" drop constraint "user_roles_role_id_foreign";`,
    );

    this.addSql(`drop table if exists "role" cascade;`);

    this.addSql(`drop table if exists "user_roles" cascade;`);

    this.addSql(
      `alter table "user" add column "role" text check ("role" in ('admin', 'user')) not null default 'user';`,
    );
  }
}
