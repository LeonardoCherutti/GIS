-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION postgres;
-- public.ar_internal_metadata definição

-- Drop table

-- DROP TABLE public.ar_internal_metadata;

CREATE TABLE public.ar_internal_metadata (
	"key" varchar NOT NULL,
	value varchar NULL,
	created_at timestamp(6) NOT NULL,
	updated_at timestamp(6) NOT NULL,
	CONSTRAINT ar_internal_metadata_pkey PRIMARY KEY (key)
);


-- public.d_cid10 definição

-- Drop table

-- DROP TABLE public.d_cid10;

CREATE TABLE public.d_cid10 (
	id varchar NOT NULL, -- Chave primária do CID-10
	"uuid" uuid DEFAULT uuidv7() NOT NULL, -- Identificador único universal
	descricao varchar(500) NOT NULL, -- Descrição do CID-10
	descricao_abreviada varchar(250) NOT NULL, -- Descrição abreviada do CID-10
	excluidos varchar(100) NULL, -- Código(s) do(s) CID-10 excluído(s)
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da criação do registro
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da última atualização do registro
	CONSTRAINT d_cid10_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX idx_dcid10_id ON public.d_cid10 USING btree (id);
CREATE UNIQUE INDEX idx_dcid10_uuid ON public.d_cid10 USING btree (uuid);

-- Column comments

COMMENT ON COLUMN public.d_cid10.id IS 'Chave primária do CID-10';
COMMENT ON COLUMN public.d_cid10."uuid" IS 'Identificador único universal';
COMMENT ON COLUMN public.d_cid10.descricao IS 'Descrição do CID-10';
COMMENT ON COLUMN public.d_cid10.descricao_abreviada IS 'Descrição abreviada do CID-10';
COMMENT ON COLUMN public.d_cid10.excluidos IS 'Código(s) do(s) CID-10 excluído(s)';
COMMENT ON COLUMN public.d_cid10.created_at IS 'Data e hora da criação do registro';
COMMENT ON COLUMN public.d_cid10.updated_at IS 'Data e hora da última atualização do registro';


-- public.d_competencia definição

-- Drop table

-- DROP TABLE public.d_competencia;

CREATE TABLE public.d_competencia (
	id int8 NOT NULL, -- Chave primária da competência no formato 'AAAAMM'
	"uuid" uuid DEFAULT uuidv7() NOT NULL, -- Identificador único universal
	ano varchar(4) NOT NULL, -- Ano da competência
	mes varchar(2) NOT NULL, -- Mês da competência
	data_inicio date NOT NULL, -- Data de início da competência
	data_fim date NOT NULL, -- Data de fim da competência
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da criação do registro
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da última atualização do registro
	CONSTRAINT d_competencia_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX idx_dcompetencia_anomes ON public.d_competencia USING btree (ano, mes);
CREATE UNIQUE INDEX idx_dcompetencia_uuid ON public.d_competencia USING btree (uuid);

-- Column comments

COMMENT ON COLUMN public.d_competencia.id IS 'Chave primária da competência no formato ''AAAAMM''';
COMMENT ON COLUMN public.d_competencia."uuid" IS 'Identificador único universal';
COMMENT ON COLUMN public.d_competencia.ano IS 'Ano da competência';
COMMENT ON COLUMN public.d_competencia.mes IS 'Mês da competência';
COMMENT ON COLUMN public.d_competencia.data_inicio IS 'Data de início da competência';
COMMENT ON COLUMN public.d_competencia.data_fim IS 'Data de fim da competência';
COMMENT ON COLUMN public.d_competencia.created_at IS 'Data e hora da criação do registro';
COMMENT ON COLUMN public.d_competencia.updated_at IS 'Data e hora da última atualização do registro';


-- public.d_natureza_juridica definição

-- Drop table

-- DROP TABLE public.d_natureza_juridica;

CREATE TABLE public.d_natureza_juridica (
	id int4 NOT NULL, -- Chave primária da natureza jurídica
	"uuid" uuid DEFAULT uuidv7() NOT NULL, -- Identificador único universal
	descricao varchar(200) NOT NULL, -- Descrição da natureza jurídica
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da criação do registro
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da última atualização do registro
	CONSTRAINT d_natureza_juridica_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX idx_dnaturezajuridica_uuid ON public.d_natureza_juridica USING btree (uuid);

-- Column comments

COMMENT ON COLUMN public.d_natureza_juridica.id IS 'Chave primária da natureza jurídica';
COMMENT ON COLUMN public.d_natureza_juridica."uuid" IS 'Identificador único universal';
COMMENT ON COLUMN public.d_natureza_juridica.descricao IS 'Descrição da natureza jurídica';
COMMENT ON COLUMN public.d_natureza_juridica.created_at IS 'Data e hora da criação do registro';
COMMENT ON COLUMN public.d_natureza_juridica.updated_at IS 'Data e hora da última atualização do registro';


-- public.d_sexo definição

-- Drop table

-- DROP TABLE public.d_sexo;

CREATE TABLE public.d_sexo (
	id varchar(4) NOT NULL, -- Chave primária do competência no formato 'AAAAMM'
	"uuid" uuid DEFAULT uuidv7() NOT NULL, -- Identificador único universal
	nome varchar(20) NOT NULL, -- Nome do sexo
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da criação do registro
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da última atualização do registro
	CONSTRAINT d_sexo_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX idx_dsexo_uuid ON public.d_sexo USING btree (uuid);

-- Column comments

COMMENT ON COLUMN public.d_sexo.id IS 'Chave primária do competência no formato ''AAAAMM''';
COMMENT ON COLUMN public.d_sexo."uuid" IS 'Identificador único universal';
COMMENT ON COLUMN public.d_sexo.nome IS 'Nome do sexo';
COMMENT ON COLUMN public.d_sexo.created_at IS 'Data e hora da criação do registro';
COMMENT ON COLUMN public.d_sexo.updated_at IS 'Data e hora da última atualização do registro';


-- public.d_uf definição

-- Drop table

-- DROP TABLE public.d_uf;

CREATE TABLE public.d_uf (
	id int4 NOT NULL, -- Chave primária da UF
	"uuid" uuid DEFAULT uuidv7() NOT NULL, -- Identificador único universal
	codigo_ibge int4 NOT NULL, -- Código IBGE da UF
	nome varchar(100) NOT NULL, -- Nome da UF
	sigla varchar(2) NOT NULL, -- Sigla da UF
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da criação do registro
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da última atualização do registro
	CONSTRAINT d_uf_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX idx_duf_codigoibge ON public.d_uf USING btree (codigo_ibge);
CREATE UNIQUE INDEX idx_duf_uuid ON public.d_uf USING btree (uuid);

-- Column comments

COMMENT ON COLUMN public.d_uf.id IS 'Chave primária da UF';
COMMENT ON COLUMN public.d_uf."uuid" IS 'Identificador único universal';
COMMENT ON COLUMN public.d_uf.codigo_ibge IS 'Código IBGE da UF';
COMMENT ON COLUMN public.d_uf.nome IS 'Nome da UF';
COMMENT ON COLUMN public.d_uf.sigla IS 'Sigla da UF';
COMMENT ON COLUMN public.d_uf.created_at IS 'Data e hora da criação do registro';
COMMENT ON COLUMN public.d_uf.updated_at IS 'Data e hora da última atualização do registro';


-- public.schema_migrations definição

-- Drop table

-- DROP TABLE public.schema_migrations;

CREATE TABLE public.schema_migrations (
	"version" varchar NOT NULL,
	CONSTRAINT schema_migrations_pkey PRIMARY KEY (version)
);


-- public.d_municipio definição

-- Drop table

-- DROP TABLE public.d_municipio;

CREATE TABLE public.d_municipio (
	id int4 NOT NULL, -- Chave primária do município (Código IBGE sem DV)
	"uuid" uuid DEFAULT uuidv7() NOT NULL, -- Identificador único universal
	uf_id int4 NOT NULL, -- Chave estrangeira para a tabela UF
	codigo_ibge int4 NOT NULL, -- Código IBGE do município
	codigo_ibge_sem_dv int4 NULL, -- Código IBGE do município sem dígito verificador
	nome varchar(50) NOT NULL, -- Nome do município
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da criação do registro
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da última atualização do registro
	CONSTRAINT d_municipio_pkey PRIMARY KEY (id),
	CONSTRAINT fk_dmunicipio_duf FOREIGN KEY (uf_id) REFERENCES public.d_uf(id)
);
CREATE UNIQUE INDEX idx_dmunicipio_codigoibge ON public.d_municipio USING btree (codigo_ibge);
CREATE UNIQUE INDEX idx_dmunicipio_codigoibgesemdv ON public.d_municipio USING btree (codigo_ibge_sem_dv);
CREATE INDEX idx_dmunicipio_ufid ON public.d_municipio USING btree (uf_id);
CREATE UNIQUE INDEX idx_dmunicipio_uuid ON public.d_municipio USING btree (uuid);

-- Column comments

COMMENT ON COLUMN public.d_municipio.id IS 'Chave primária do município (Código IBGE sem DV)';
COMMENT ON COLUMN public.d_municipio."uuid" IS 'Identificador único universal';
COMMENT ON COLUMN public.d_municipio.uf_id IS 'Chave estrangeira para a tabela UF';
COMMENT ON COLUMN public.d_municipio.codigo_ibge IS 'Código IBGE do município';
COMMENT ON COLUMN public.d_municipio.codigo_ibge_sem_dv IS 'Código IBGE do município sem dígito verificador';
COMMENT ON COLUMN public.d_municipio.nome IS 'Nome do município';
COMMENT ON COLUMN public.d_municipio.created_at IS 'Data e hora da criação do registro';
COMMENT ON COLUMN public.d_municipio.updated_at IS 'Data e hora da última atualização do registro';