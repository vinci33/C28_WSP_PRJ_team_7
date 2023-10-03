CREATE TABLE "shippings"(
    "id" BIGINT NOT NULL,
    "order_id" BIGINT NOT NULL,
    "ship_name" BIGINT NOT NULL,
    "ship_phone" BIGINT NOT NULL,
    "ship_email" BIGINT NOT NULL,
    "ship_address" BIGINT NOT NULL,
    "ship_city" BIGINT NOT NULL
);
ALTER TABLE
    "shippings" ADD PRIMARY KEY("id");
CREATE TABLE "subcategories"(
    "id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "subcategory_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "modified_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "subcategories" ADD PRIMARY KEY("id");
ALTER TABLE
    "subcategories" ADD CONSTRAINT "subcategories_subcategory_name_unique" UNIQUE("subcategory_name");
CREATE TABLE "brands"(
    "id" INTEGER NOT NULL,
    "brand_name" VARCHAR(255) NOT NULL,
    "brand_logo" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "modified_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "brands" ADD PRIMARY KEY("id");
ALTER TABLE
    "brands" ADD CONSTRAINT "brands_brand_name_unique" UNIQUE("brand_name");
CREATE TABLE "login"(
    "id" VARCHAR(255) NOT NULL,
    "passward" BIGINT NOT NULL
);
ALTER TABLE
    "login" ADD PRIMARY KEY("id");
CREATE TABLE "categories"(
    "id" INTEGER NOT NULL,
    "categories_name" BIGINT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "modified_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "categories" ADD PRIMARY KEY("id");
ALTER TABLE
    "categories" ADD CONSTRAINT "categories_categories_name_unique" UNIQUE("categories_name");
CREATE TABLE "cat_product"(
    "id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "cat_id" BIGINT NOT NULL
);
ALTER TABLE
    "cat_product" ADD PRIMARY KEY("id");
CREATE TABLE "order_items"(
    "id" BIGINT NOT NULL,
    "order_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "product_color" VARCHAR(255) NOT NULL,
    "product_size" VARCHAR(255) NOT NULL,
    "product_quantity" BIGINT NOT NULL,
    "selling_price" BIGINT NOT NULL,
    "product_total_price" BIGINT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "modified_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "order_items" ADD PRIMARY KEY("id");
CREATE TABLE "users"(
    "id" INTEGER NOT NULL,
    "user_name" BIGINT NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255) NULL,
    "email" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "modified_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "users" ADD PRIMARY KEY("id");
ALTER TABLE
    "users" ADD CONSTRAINT "users_user_name_unique" UNIQUE("user_name");
ALTER TABLE
    "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");
CREATE TABLE "order"(
    "id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "total_amount" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "modified_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "order" ADD PRIMARY KEY("id");
CREATE TABLE "post_categories"(
    "id" INTEGER NOT NULL,
    "category_name" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "post_categories" ADD PRIMARY KEY("id");
CREATE TABLE "posts"(
    "id" INTEGER NOT NULL,
    "post_category_id" INTEGER NOT NULL,
    "post_title" VARCHAR(255) NOT NULL,
    "post_image" VARCHAR(255) NOT NULL,
    "details" TEXT NOT NULL
);
ALTER TABLE
    "posts" ADD PRIMARY KEY("id");
ALTER TABLE
    "posts" ADD CONSTRAINT "posts_post_title_unique" UNIQUE("post_title");
CREATE TABLE "shopping_cart"(
    "id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "product_code" VARCHAR(255) NOT NULL,
    "product_id" BIGINT NOT NULL,
    "product_color" VARCHAR(255) NOT NULL,
    "product_size" VARCHAR(255) NOT NULL,
    "product_quantity" BIGINT NOT NULL,
    "selling_price" BIGINT NOT NULL,
    "product_total_price" BIGINT NOT NULL,
    "total_amount" BIGINT NOT NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "modified_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "shopping_cart" ADD PRIMARY KEY("id");
CREATE TABLE "product"(
    "id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "product_code" VARCHAR(255) NOT NULL,
    "brand_name" VARCHAR(255) NOT NULL,
    "product_details" TEXT NOT NULL,
    "product_color" VARCHAR(255) NOT NULL,
    "product_size" VARCHAR(255) NOT NULL,
    "selling_price" INTEGER NOT NULL,
    "image_one" VARCHAR(255) NOT NULL,
    "image_two" VARCHAR(255) NULL,
    "image_three" VARCHAR(255) NULL,
    "created_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL,
    "modified_at" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL
);
ALTER TABLE
    "product" ADD PRIMARY KEY("id");
ALTER TABLE
    "product" ADD CONSTRAINT "product_product_name_unique" UNIQUE("product_name");
ALTER TABLE
    "product" ADD CONSTRAINT "product_product_code_unique" UNIQUE("product_code");
CREATE TABLE "register"(
    "id" VARCHAR(255) NOT NULL,
    "passward" BIGINT NOT NULL
);
ALTER TABLE
    "register" ADD PRIMARY KEY("id");
ALTER TABLE
    "order" ADD CONSTRAINT "order_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "order_items" ADD CONSTRAINT "order_items_product_id_foreign" FOREIGN KEY("product_id") REFERENCES "product"("id");
ALTER TABLE
    "product" ADD CONSTRAINT "product_category_id_foreign" FOREIGN KEY("category_id") REFERENCES "categories"("id");
ALTER TABLE
    "shopping_cart" ADD CONSTRAINT "shopping_cart_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "shopping_cart" ADD CONSTRAINT "shopping_cart_product_id_foreign" FOREIGN KEY("product_id") REFERENCES "product"("id");
ALTER TABLE
    "order_items" ADD CONSTRAINT "order_items_order_id_foreign" FOREIGN KEY("order_id") REFERENCES "order"("id");