import { Migration } from '@mikro-orm/migrations';

export class Migration20250803091634 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "user" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "username" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) null, "role" text check ("role" in ('admin', 'user')) not null default 'user', "provider" text check ("provider" in ('local', 'google')) not null, "provider_id" varchar(255) null, "vefified" boolean not null, "avatar" varchar(255) null, "is_active" boolean not null, constraint "user_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "user" add constraint "user_username_unique" unique ("username");`,
    );
    this.addSql(
      `alter table "user" add constraint "user_email_unique" unique ("email");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "user" cascade;`);
  }
}
