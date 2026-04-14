-- DROP SCHEMA cnes;

CREATE SCHEMA cnes AUTHORIZATION postgres;

-- DROP SEQUENCE cnes.d_estabelecimento_id_seq;

CREATE SEQUENCE cnes.d_estabelecimento_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE cnes.d_habilitacao_id_seq;

CREATE SEQUENCE cnes.d_habilitacao_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE cnes.d_tipo_estabelecimento_id_seq;

CREATE SEQUENCE cnes.d_tipo_estabelecimento_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE cnes.d_tipo_unidade_id_seq;

CREATE SEQUENCE cnes.d_tipo_unidade_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;-- cnes.d_habilitacao definição

-- Drop table

-- DROP TABLE cnes.d_habilitacao;

CREATE TABLE cnes.d_habilitacao (
	id bigserial NOT NULL,
	"uuid" uuid DEFAULT uuidv7() NOT NULL,
	codigo_habilitacao_cnes varchar(6) NOT NULL,
	descricao varchar(255) NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT d_habilitacao_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX idx_dhabilitacao_codigohabilitacaocnes ON cnes.d_habilitacao USING btree (codigo_habilitacao_cnes);
CREATE UNIQUE INDEX idx_dhabilitacao_uuid ON cnes.d_habilitacao USING btree (uuid);


-- cnes.d_tipo_estabelecimento definição

-- Drop table

-- DROP TABLE cnes.d_tipo_estabelecimento;

CREATE TABLE cnes.d_tipo_estabelecimento (
	id serial4 NOT NULL,
	"uuid" uuid DEFAULT uuidv7() NOT NULL,
	codigo varchar(3) NOT NULL,
	descricao varchar(100) NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT d_tipo_estabelecimento_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX idx_dtipoeestab_codigo ON cnes.d_tipo_estabelecimento USING btree (codigo);
CREATE UNIQUE INDEX idx_dtipoeestab_uuid ON cnes.d_tipo_estabelecimento USING btree (uuid);


-- cnes.d_tipo_leito definição

-- Drop table

-- DROP TABLE cnes.d_tipo_leito;

CREATE TABLE cnes.d_tipo_leito (
	id int4 NOT NULL,
	"uuid" uuid DEFAULT uuidv7() NOT NULL,
	descricao varchar(500) NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT d_tipo_leito_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX idx_dtipoleito_id ON cnes.d_tipo_leito USING btree (id);
CREATE UNIQUE INDEX idx_dtipoleito_uuid ON cnes.d_tipo_leito USING btree (uuid);


-- cnes.d_tipo_unidade definição

-- Drop table

-- DROP TABLE cnes.d_tipo_unidade;

CREATE TABLE cnes.d_tipo_unidade (
	id serial4 NOT NULL,
	"uuid" uuid DEFAULT uuidv7() NOT NULL,
	codigo varchar(3) NOT NULL,
	descricao varchar(100) NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT d_tipo_unidade_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX idx_dtipounidade_codigo ON cnes.d_tipo_unidade USING btree (codigo);
CREATE UNIQUE INDEX idx_dtipounidade_uuid ON cnes.d_tipo_unidade USING btree (uuid);


-- cnes.d_tipo_unidade_leito definição

-- Drop table

-- DROP TABLE cnes.d_tipo_unidade_leito;

CREATE TABLE cnes.d_tipo_unidade_leito (
	id varchar(2) NOT NULL,
	"uuid" uuid DEFAULT uuidv7() NOT NULL,
	descricao varchar(500) NOT NULL,
	tipo_leito_id int4 NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT d_tipo_unidade_leito_pkey PRIMARY KEY (id),
	CONSTRAINT fk_dtipounidadeleito_dtipoleito FOREIGN KEY (tipo_leito_id) REFERENCES cnes.d_tipo_leito(id)
);
CREATE UNIQUE INDEX idx_dtipounidadeleito_id ON cnes.d_tipo_unidade_leito USING btree (id);
CREATE INDEX idx_dtipounidadeleito_tipoleitoid ON cnes.d_tipo_unidade_leito USING btree (tipo_leito_id);
CREATE UNIQUE INDEX idx_dtipounidadeleito_uuid ON cnes.d_tipo_unidade_leito USING btree (uuid);


-- cnes.d_estabelecimento definição

-- Drop table

-- DROP TABLE cnes.d_estabelecimento;

CREATE TABLE cnes.d_estabelecimento (
	id bigserial NOT NULL,
	"uuid" uuid DEFAULT uuidv7() NOT NULL,
	competencia_id int4 NOT NULL,
	tipo_estabelecimento_id int4 NOT NULL,
	tipo_unidade_id int4 NOT NULL,
	natureza_juridica_id int4 NULL,
	uf_id int4 NOT NULL,
	municipio_id int8 NOT NULL,
	tipo_gestao varchar(1) NULL,
	tipo_enquadramento varchar NOT NULL,
	tipo_dependencia_administrativa varchar NOT NULL,
	codigo_estabelecimento varchar(31) NOT NULL,
	codigo_cnes varchar(7) NOT NULL,
	cpf varchar(11) NULL,
	cnpj varchar(14) NULL,
	cnpj_mantenedora varchar(14) NULL,
	razao_social varchar(60) NULL,
	nome_fantasia varchar(60) NULL,
	logradouro varchar(60) NULL,
	numero varchar(10) NULL,
	complemento varchar(20) NULL,
	bairro varchar(60) NULL,
	cep varchar(8) NOT NULL,
	data_cadastro date NULL,
	data_atualizacao date NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT d_estabelecimento_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_destabelecimento_cnpj ON cnes.d_estabelecimento USING btree (cnpj);
CREATE INDEX idx_destabelecimento_cnpjmantenedora ON cnes.d_estabelecimento USING btree (cnpj_mantenedora);
CREATE INDEX idx_destabelecimento_codigocnes ON cnes.d_estabelecimento USING btree (codigo_cnes);
CREATE INDEX idx_destabelecimento_competenciaid ON cnes.d_estabelecimento USING btree (competencia_id);
CREATE UNIQUE INDEX idx_destabelecimento_competenciaid_codigocnes ON cnes.d_estabelecimento USING btree (competencia_id, codigo_cnes);
CREATE INDEX idx_destabelecimento_cpf ON cnes.d_estabelecimento USING btree (cpf);
CREATE INDEX idx_destabelecimento_municipioid ON cnes.d_estabelecimento USING btree (municipio_id);
CREATE INDEX idx_destabelecimento_naturezajuridicaid ON cnes.d_estabelecimento USING btree (natureza_juridica_id);
CREATE INDEX idx_destabelecimento_tipoestabelecimentoid ON cnes.d_estabelecimento USING btree (tipo_estabelecimento_id);
CREATE INDEX idx_destabelecimento_tipounidadeid ON cnes.d_estabelecimento USING btree (tipo_unidade_id);
CREATE INDEX idx_destabelecimento_ufid ON cnes.d_estabelecimento USING btree (uf_id);
CREATE INDEX idx_destabelecimento_uuid ON cnes.d_estabelecimento USING btree (uuid);


-- cnes.f_estabelecimento_habilitacao definição

-- Drop table

-- DROP TABLE cnes.f_estabelecimento_habilitacao;

CREATE TABLE cnes.f_estabelecimento_habilitacao (
	"uuid" uuid DEFAULT uuidv7() NOT NULL,
	competencia_id int4 NOT NULL,
	estabelecimento_id int8 NOT NULL,
	habilitacao_id int4 NOT NULL,
	competencia_inicio varchar(6) NOT NULL,
	competencia_fim varchar(6) NOT NULL,
	quantidade_leitos int4 NOT NULL,
	portaria varchar(200) NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX idx_festabelecimentohabilitacao_competenciaid ON cnes.f_estabelecimento_habilitacao USING btree (competencia_id);
CREATE INDEX idx_festabelecimentohabilitacao_estabelecimentoid ON cnes.f_estabelecimento_habilitacao USING btree (estabelecimento_id);
CREATE INDEX idx_festabelecimentohabilitacao_habilitacaoid ON cnes.f_estabelecimento_habilitacao USING btree (habilitacao_id);
CREATE INDEX idx_festabelecimentohabilitacao_uuid ON cnes.f_estabelecimento_habilitacao USING btree (uuid);


-- cnes.f_estabelecimento_leito definição

-- Drop table

-- DROP TABLE cnes.f_estabelecimento_leito;

CREATE TABLE cnes.f_estabelecimento_leito (
	"uuid" uuid DEFAULT uuidv7() NOT NULL,
	competencia_id int4 NOT NULL,
	estabelecimento_id int8 NOT NULL,
	tipo_leito_id int4 NOT NULL,
	tipo_unidade_leito_id varchar(2) NOT NULL,
	quantidade_total int4 NOT NULL,
	quantidade_leitos_sus int4 NOT NULL,
	quantidade_leitos_nao_sus int4 NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE INDEX idx_festabelecimentoleito_competencia_id ON cnes.f_estabelecimento_leito USING btree (competencia_id);
CREATE INDEX idx_festabelecimentoleito_estabelecimentoid ON cnes.f_estabelecimento_leito USING btree (estabelecimento_id);
CREATE INDEX idx_festabelecimentoleito_tipoleitoid ON cnes.f_estabelecimento_leito USING btree (tipo_leito_id);
CREATE INDEX idx_festabelecimentoleito_tipounidadeleitoid ON cnes.f_estabelecimento_leito USING btree (tipo_unidade_leito_id);
CREATE INDEX idx_festabelecimentoleito_uuid ON cnes.f_estabelecimento_leito USING btree (uuid);


-- cnes.d_estabelecimento chaves estrangeiras

ALTER TABLE cnes.d_estabelecimento ADD CONSTRAINT fk_destabelecimento_dcompetencia FOREIGN KEY (competencia_id) REFERENCES public.d_competencia(id);
ALTER TABLE cnes.d_estabelecimento ADD CONSTRAINT fk_destabelecimento_dmunicipio FOREIGN KEY (municipio_id) REFERENCES public.d_municipio(id);
ALTER TABLE cnes.d_estabelecimento ADD CONSTRAINT fk_destabelecimento_dnaturezajuridica FOREIGN KEY (natureza_juridica_id) REFERENCES public.d_natureza_juridica(id);
ALTER TABLE cnes.d_estabelecimento ADD CONSTRAINT fk_destabelecimento_dtipoestabelecimento FOREIGN KEY (tipo_estabelecimento_id) REFERENCES cnes.d_tipo_estabelecimento(id);
ALTER TABLE cnes.d_estabelecimento ADD CONSTRAINT fk_destabelecimento_dtipounidade FOREIGN KEY (tipo_unidade_id) REFERENCES cnes.d_tipo_unidade(id);
ALTER TABLE cnes.d_estabelecimento ADD CONSTRAINT fk_destabelecimento_duf FOREIGN KEY (uf_id) REFERENCES public.d_uf(id);


-- cnes.f_estabelecimento_habilitacao chaves estrangeiras

ALTER TABLE cnes.f_estabelecimento_habilitacao ADD CONSTRAINT fk_festabelecimentohabilitacao_dcompetencia FOREIGN KEY (competencia_id) REFERENCES public.d_competencia(id);
ALTER TABLE cnes.f_estabelecimento_habilitacao ADD CONSTRAINT fk_festabelecimentohabilitacao_destabelecimento FOREIGN KEY (estabelecimento_id) REFERENCES cnes.d_estabelecimento(id);
ALTER TABLE cnes.f_estabelecimento_habilitacao ADD CONSTRAINT fk_festabelecimentohabilitacao_dhabilitacao FOREIGN KEY (habilitacao_id) REFERENCES cnes.d_habilitacao(id);


-- cnes.f_estabelecimento_leito chaves estrangeiras

ALTER TABLE cnes.f_estabelecimento_leito ADD CONSTRAINT fk_festabelecimentoleito_dcompetencia FOREIGN KEY (competencia_id) REFERENCES public.d_competencia(id);
ALTER TABLE cnes.f_estabelecimento_leito ADD CONSTRAINT fk_festabelecimentoleito_destabelecimento FOREIGN KEY (estabelecimento_id) REFERENCES cnes.d_estabelecimento(id);
ALTER TABLE cnes.f_estabelecimento_leito ADD CONSTRAINT fk_festabelecimentoleito_dtipoleito FOREIGN KEY (tipo_leito_id) REFERENCES cnes.d_tipo_leito(id);
ALTER TABLE cnes.f_estabelecimento_leito ADD CONSTRAINT fk_festabelecimentoleito_dtipounidadeleito FOREIGN KEY (tipo_unidade_leito_id) REFERENCES cnes.d_tipo_unidade_leito(id);