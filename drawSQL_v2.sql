/* can use `psql -U username -W -d db_name -f file.sql` to run this file */
DROP TABLE IF EXISTS "order_items"   CASCADE;
DROP TABLE IF EXISTS "order"  CASCADE;  /*drop old table name if exist*/

DROP TABLE IF EXISTS "categories"  CASCADE; /*drop all table and insert all new data */
DROP TABLE IF EXISTS "order_detail_items" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;
DROP TABLE IF EXISTS "orders" CASCADE;
DROP TABLE IF EXISTS "`orders`" CASCADE;
DROP TABLE IF EXISTS "shopping_cart"  CASCADE;
DROP TABLE IF EXISTS "products" CASCADE;

-- TODO: Drop Table start
DROP TABLE IF EXISTS "user_address" CASCADE;
DROP TABLE IF EXISTS "delivery" CASCADE;
DROP TABLE IF EXISTS "delivery_address" CASCADE;
DROP TABLE IF EXISTS "delivery_contacts" CASCADE;
-- TODO: Drop Table end


CREATE TABLE "categories"(
    "id" SERIAL primary key,
    "categories_name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "categories" ADD CONSTRAINT "categories_categories_name_unique" UNIQUE("categories_name");


CREATE TABLE "users"(
    "id" SERIAL primary key,
    "user_name" VARCHAR(255) NULL,
    "password" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(255) NULL,
    "last_name" VARCHAR(255) NULL,
    "phone" VARCHAR(255) NULL,
    "email" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "users" ADD CONSTRAINT "users_user_name_unique" UNIQUE("user_name");
ALTER TABLE
    "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");


CREATE TABLE "user_address"(
    "id" SERIAL primary key,
    "user_id" BIGINT NOT NULL,
    "address1" VARCHAR(255) NOT NULL,
    "address2" VARCHAR(255) NULL,
    "street" VARCHAR(255) NULL,
    "city" VARCHAR(255) NULL,
    "postal_code" INTEGER,
    "country"  VARCHAR(255) NULL,
    "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "user_address" ADD CONSTRAINT "user_address_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");

CREATE TABLE "products"(
    "id" SERIAL primary key,
    "category_id" INTEGER NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "product_details" TEXT NOT NULL,
    "product_color" VARCHAR(255) NOT NULL,
    "product_size" VARCHAR(255) NULL,
    "selling_price" INTEGER NOT NULL,
    "image_one" VARCHAR(255) NOT NULL,
    "image_two" VARCHAR(255) NULL,
    "image_three" VARCHAR(255) NULL,
    "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "orders"(
    "id" SERIAL primary key,
    "user_id" BIGINT NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "payment_status" VARCHAR(255) NOT NULL,
    "payment_method" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "orders" ADD CONSTRAINT "orders_user_id_foreign" 
    FOREIGN KEY("user_id") REFERENCES "users"("id");

CREATE TABLE "order_detail_items"(
    "id" SERIAL primary key,
    "order_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "product_color" VARCHAR(255) NOT NULL,
    "product_size" VARCHAR(255) NULL,
    "product_quantity" BIGINT NOT NULL,
    "selling_price" BIGINT NOT NULL,
    "product_total_price" BIGINT NOT NULL,
    "created_at"  TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "order_detail_items" ADD CONSTRAINT "order_detail_items_order_id_foreign" 
    FOREIGN KEY("order_id") REFERENCES "orders"("id");
ALTER TABLE
    "order_detail_items" ADD CONSTRAINT "order_detail_items_product_id_foreign" 
    FOREIGN KEY("product_id") REFERENCES "products"("id");
    

CREATE TABLE "delivery_contacts"(
    "id" SERIAL primary key,
    "order_id" INTEGER NOT NULL,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY("order_id") REFERENCES "orders"("id")
);

CREATE TABLE "delivery_address"(
    "id" SERIAL primary key,
    "delivery_contact_id" INTEGER NOT NULL,
    "address1" VARCHAR(255) NOT NULL,
    "address2" VARCHAR(255) NOT NULL,
    "street" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "postal_code" INTEGER NOT NULL,
    "country"  VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY("delivery_contact_id") REFERENCES "delivery_contacts"("id")
);


CREATE TABLE "shopping_cart"(
    "id" SERIAL primary key,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "product_quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);



ALTER TABLE
    "products" ADD CONSTRAINT "products_category_id_foreign" FOREIGN KEY("category_id") REFERENCES "categories"("id");
ALTER TABLE
    "shopping_cart" ADD CONSTRAINT "shopping_cart_user_id_foreign" FOREIGN KEY("user_id") REFERENCES "users"("id");
ALTER TABLE
    "shopping_cart" ADD CONSTRAINT "shopping_cart_product_id_foreign" FOREIGN KEY("product_id") REFERENCES "products"("id");

INSERT INTO categories (categories_name,created_at,modified_at)
VALUES 
('iphone',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('airpods',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('ipad',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO users (user_name,password,first_name,last_name,phone,email,created_at,modified_at)
VALUES
('john','0000','john','chan','99229922','john@gmail.com',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO users (user_name,password,first_name,last_name,phone,email,created_at,modified_at)
VALUES
('ken','0000','ken','lai','11111','111@gmail.com',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO products (category_id,product_name,product_details,product_color,product_size,selling_price,image_one,image_two,image_three,created_at,modified_at)
VALUES
(1,'iphone_15','iphone_15 128gb','blue','128gb',6899,'../asset/product-img/iphone_15/iphone_15_blue.jpg','null','null','2023-09-01T18:29:40.000Z','2023-09-01T18:29:40.000Z'),
(1,'iphone_15','iphone_15 128gb','pink','128gb',6899,'../asset/product-img/iphone_15/iphone_15_pink.jpg','null','null','2023-09-01T18:29:40.000Z','2023-09-01T18:29:40.000Z'),
(1,'iphone_15_pro','iphone_15_pro 128gb','black','128gb',8599,'../asset/product-img/iphone_15_pro/iphone_15_pro_black.jpg','null','null','2023-09-03T18:29:40.000Z','2023-09-03T18:29:40.000Z'),
(1,'iphone_15_pro','iphone_15_pro 128gb natural','natural','128gb',8599,'../asset/product-img/iphone_15_pro/iphone_15_pro_natural.jpg','null','null','2023-09-03T18:29:40.000Z','2023-09-03T18:29:40.000Z'),
(3,'ipad_air','ipad_air 256gb wifi','blue','256gb',5999,'../asset/product-img/ipad_air/ipad_air_blue.jpg','null','null','2023-10-01T18:29:40.000Z','2023-10-01T18:29:40.000Z'),
(3,'ipad_air','ipad_air 256gb wifi','purple','256gb',5999,'../asset/product-img/ipad_air/ipad_air_purple.jpg','null','null','2023-10-01T18:29:40.000Z','2023-10-01T18:29:40.000Z'),
(3,'ipad_pro','ipad_pro 128gb 11inch wifi','grey','128gb',6499,'../asset/product-img/ipad_pro/ipad_pro1.jpg','../asset/product-img/ipad_pro/ipad_pro2.jpg','../asset/product-img/ipad_pro/ipad_pro3.jpg','2023-10-01T18:29:40.000Z','2023-10-01T18:29:40.000Z'),
(2,'airpods','airpods 3rd gen','white','null',1499,'../asset/product-img/airpods/airpods1.jpeg','../asset/product-img/airpods/airpods2.jpeg','../asset/product-img/airpods/airpods3.jpeg','2023-10-02T18:29:40.000Z','2023-10-02T18:29:40.000Z'),
(2,'airpods_pro','airpods 2nd gen','white','null',1849,'../asset/product-img/airpods_pro/airpods_pro1.jpeg','../asset/product-img/airpods_pro/airpods_pro2.jpeg','../asset/product-img/airpods_pro/airpods_pro3.jpeg','2023-10-02T18:29:40.000Z','2023-10-02T18:29:40.000Z');
INSERT INTO shopping_cart (user_id,product_id,product_quantity,created_at,modified_at)
VALUES
(1,1,2,'2023-10-08T18:29:40.000Z','2023-10-08T18:29:40.000Z'),
(1,5,3,'2023-10-08T18:29:40.000Z','2023-10-08T18:29:40.000Z');