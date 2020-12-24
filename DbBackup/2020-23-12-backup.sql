CREATE TABLE public.messages (
    id integer NOT NULL DEFAULT nextval('messages_id_seq' :: regclass),
    user_id integer NOT NULL,
    text text COLLATE pg_catalog."default",
    created_date timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT messages_pkey PRIMARY KEY (id),
    CONSTRAINT messages_user_fk FOREIGN KEY (user_id) REFERENCES public.users (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE public.users (
    id integer NOT NULL DEFAULT nextval('users_id_seq' :: regclass),
    username text COLLATE pg_catalog."default",
    created_date timestamp without time zone DEFAULT now(),
    password text COLLATE pg_catalog."default",
    last_active_at timestamp without time zone DEFAULT now(),
    is_logged_in boolean NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);