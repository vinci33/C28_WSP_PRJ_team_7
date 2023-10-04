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
CREATE TABLE "order_items"(
    "id" BIGINT NOT NULL,
    "order_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "product_color" VARCHAR(255) NOT NULL,
    "product_size" VARCHAR(255) NULL,
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
CREATE TABLE "shopping_cart"(
    "id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "product_id" BIGINT NOT NULL,
    "product_color" VARCHAR(255) NOT NULL,
    "product_size" VARCHAR(255) NULL,
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
    "product_color" VARCHAR(255) NOT NULL,
    "product_size" VARCHAR(255) NULL,
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



INSERT INTO categories (categories_name) VALUES ('iphone','airpods','ipad');
INSERT INTO product (product_name,product_details,product_color,product_size,selling_price,image_one,image_two,image_three) VALUES ('iphone_15','iphone_15_pro','airpods','airpods_pro','ipad_air','ipad_pro','black','blue','green','yellow','pink','natural_titanium','blue_titanium','white_titanium','black_titanium','white','space_grey','blue','pink','purple','starlight','silver','64gb','128gb','256gb','512gb','1tb','2tb',7699,8499,10199,8599,9399,11099,12799,1099,1849,4799,5999,6499,7299,8899,12099.15299,'./img/iphone_15_pro/iphone_15_pro_black.jpg','./img/iphone_15_pro/iphone_15_pro_natural.jpg','./img/iphone_15_pro/iphone_15_pro_blue.jpg');
INSERT INTO shopping_cart (product_name,product_color,product_size,product_quantity,selling_price,product_total_price,total_amount) VALUES ('iphone_15_pro','airpods_pro','ipad_pro','black','blue','green','yellow','pink','natural_titanium','blue_titanium','white_titanium','black_titanium','white','space_grey','blue','pink','purple','starlight','silver','128gb','256gb','512gb','1tb',7699,8499,10199,8599,9399,11099,12799,1099,1849,4799,5999,6499,7299,8899,12099.15299);
INSERT INTO order (product_color,product_size,product_quantity,selling_price,product_total_price) VALUES ('black','blue','green','yellow','pink','natural_titanium','blue_titanium','white_titanium','black_titanium','white','space_grey','blue','pink','purple','starlight','silver','64gb','128gb','256gb','512gb','1tb','2tb',7699,8499,10199,8599,9399,11099,12799,1099,1849,4799,5999,6499,7299,8899,12099.15299);
INSERT INTO order_items (total_amount) VALUES (8499);
INSERT INTO users (user_name,password,first_name,last_name,phone,email) VALUES ('john','0000','john','chan','99229922','john@gmail.com');


