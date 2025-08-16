import { Migration } from '@mikro-orm/migrations';

export class Migration20250816095727 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "roles" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, constraint "roles_pkey" primary key ("id"));`);
    this.addSql(`alter table "roles" add constraint "roles_name_unique" unique ("name");`);

    this.addSql(`create table "users" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "username" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) null, "provider" text check ("provider" in ('local', 'google')) not null, "provider_id" varchar(255) null, "verified" boolean null default false, "avatar" varchar(255) null, "is_active" boolean null default true, constraint "users_pkey" primary key ("id"));`);
    this.addSql(`alter table "users" add constraint "users_username_unique" unique ("username");`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);

    this.addSql(`create table "users_roles" ("user_id" uuid not null, "role_id" uuid not null, constraint "users_roles_pkey" primary key ("user_id", "role_id"));`);

    this.addSql(`alter table "users_roles" add constraint "users_roles_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "users_roles" add constraint "users_roles_role_id_foreign" foreign key ("role_id") references "roles" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users_roles" drop constraint "users_roles_role_id_foreign";`);

    this.addSql(`alter table "users_roles" drop constraint "users_roles_user_id_foreign";`);

    this.addSql(`drop table if exists "roles" cascade;`);

    this.addSql(`drop table if exists "users" cascade;`);

    this.addSql(`drop table if exists "users_roles" cascade;`);
  }

}
