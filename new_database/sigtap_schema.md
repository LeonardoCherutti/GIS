-- DROP SCHEMA sigtap;

CREATE SCHEMA sigtap AUTHORIZATION postgres;

-- DROP SEQUENCE sigtap.d_complexidade_id_seq;

CREATE SEQUENCE sigtap.d_complexidade_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE sigtap.d_detalhe_id_seq;

CREATE SEQUENCE sigtap.d_detalhe_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE sigtap.d_procedimento_id_seq;

CREATE SEQUENCE sigtap.d_procedimento_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;-- sigtap.d_complexidade definição

-- Drop table

-- DROP TABLE sigtap.d_complexidade;

CREATE TABLE sigtap.d_complexidade (
	id serial4 NOT NULL, -- Chave primária da complexidade
	"uuid" uuid DEFAULT uuidv7() NOT NULL, -- Identificador único universal
	nome varchar(20) NOT NULL, -- Nome da complexidade
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da criação do registro
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da última atualização do registro
	CONSTRAINT d_complexidade_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX idx_dcomplexidade_uuid ON sigtap.d_complexidade USING btree (uuid);

-- Column comments

COMMENT ON COLUMN sigtap.d_complexidade.id IS 'Chave primária da complexidade';
COMMENT ON COLUMN sigtap.d_complexidade."uuid" IS 'Identificador único universal';
COMMENT ON COLUMN sigtap.d_complexidade.nome IS 'Nome da complexidade';
COMMENT ON COLUMN sigtap.d_complexidade.created_at IS 'Data e hora da criação do registro';
COMMENT ON COLUMN sigtap.d_complexidade.updated_at IS 'Data e hora da última atualização do registro';


-- sigtap.d_detalhe definição

-- Drop table

-- DROP TABLE sigtap.d_detalhe;

CREATE TABLE sigtap.d_detalhe (
	id serial4 NOT NULL, -- Chave primária do detalhe
	"uuid" uuid DEFAULT uuidv7() NOT NULL, -- Identificador único universal
	codigo varchar(3) NOT NULL, -- Código do detalhe
	nome varchar(100) NOT NULL, -- Nome do detalhe
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da criação do registro
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da última atualização do registro
	CONSTRAINT d_detalhe_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX idx_ddetalhe_codigo ON sigtap.d_detalhe USING btree (codigo);
CREATE UNIQUE INDEX idx_ddetalhe_uuid ON sigtap.d_detalhe USING btree (uuid);

-- Column comments

COMMENT ON COLUMN sigtap.d_detalhe.id IS 'Chave primária do detalhe';
COMMENT ON COLUMN sigtap.d_detalhe."uuid" IS 'Identificador único universal';
COMMENT ON COLUMN sigtap.d_detalhe.codigo IS 'Código do detalhe';
COMMENT ON COLUMN sigtap.d_detalhe.nome IS 'Nome do detalhe';
COMMENT ON COLUMN sigtap.d_detalhe.created_at IS 'Data e hora da criação do registro';
COMMENT ON COLUMN sigtap.d_detalhe.updated_at IS 'Data e hora da última atualização do registro';


-- sigtap.d_financiamento definição

-- Drop table

-- DROP TABLE sigtap.d_financiamento;

CREATE TABLE sigtap.d_financiamento (
	id varchar(2) NOT NULL, -- Chave primária do financiamento
	"uuid" uuid DEFAULT uuidv7() NOT NULL, -- Identificador único universal
	nome varchar(100) NOT NULL, -- Nome da forma de financiamento
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da criação do registro
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da última atualização do registro
	CONSTRAINT d_financiamento_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX idx_dfinanciamento_uuid ON sigtap.d_financiamento USING btree (uuid);

-- Column comments

COMMENT ON COLUMN sigtap.d_financiamento.id IS 'Chave primária do financiamento';
COMMENT ON COLUMN sigtap.d_financiamento."uuid" IS 'Identificador único universal';
COMMENT ON COLUMN sigtap.d_financiamento.nome IS 'Nome da forma de financiamento';
COMMENT ON COLUMN sigtap.d_financiamento.created_at IS 'Data e hora da criação do registro';
COMMENT ON COLUMN sigtap.d_financiamento.updated_at IS 'Data e hora da última atualização do registro';


-- sigtap.d_grupo definição

-- Drop table

-- DROP TABLE sigtap.d_grupo;

CREATE TABLE sigtap.d_grupo (
	id varchar(2) NOT NULL, -- Chave primária do grupo
	"uuid" uuid DEFAULT uuidv7() NOT NULL, -- Identificador único universal
	nome varchar(100) NOT NULL, -- Nome do grupo
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da criação do registro
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da última atualização do registro
	CONSTRAINT d_grupo_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX idx_dgrupo_uuid ON sigtap.d_grupo USING btree (uuid);

-- Column comments

COMMENT ON COLUMN sigtap.d_grupo.id IS 'Chave primária do grupo';
COMMENT ON COLUMN sigtap.d_grupo."uuid" IS 'Identificador único universal';
COMMENT ON COLUMN sigtap.d_grupo.nome IS 'Nome do grupo';
COMMENT ON COLUMN sigtap.d_grupo.created_at IS 'Data e hora da criação do registro';
COMMENT ON COLUMN sigtap.d_grupo.updated_at IS 'Data e hora da última atualização do registro';


-- sigtap.d_subgrupo definição

-- Drop table

-- DROP TABLE sigtap.d_subgrupo;

CREATE TABLE sigtap.d_subgrupo (
	id varchar(4) NOT NULL, -- Chave primária do subgrupo
	"uuid" uuid DEFAULT uuidv7() NOT NULL, -- Identificador único universal
	grupo_id varchar(2) NOT NULL, -- Chave estrangeira referenciando o grupo
	nome varchar(100) NOT NULL, -- Nome do subgrupo
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da criação do registro
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da última atualização do registro
	CONSTRAINT d_subgrupo_pkey PRIMARY KEY (id),
	CONSTRAINT fk_dsubgrupo_dgrupo FOREIGN KEY (grupo_id) REFERENCES sigtap.d_grupo(id)
);
CREATE INDEX idx_dsubgrupo_grupoid ON sigtap.d_subgrupo USING btree (grupo_id);
CREATE UNIQUE INDEX idx_dsubgrupo_uuid ON sigtap.d_subgrupo USING btree (uuid);

-- Column comments

COMMENT ON COLUMN sigtap.d_subgrupo.id IS 'Chave primária do subgrupo';
COMMENT ON COLUMN sigtap.d_subgrupo."uuid" IS 'Identificador único universal';
COMMENT ON COLUMN sigtap.d_subgrupo.grupo_id IS 'Chave estrangeira referenciando o grupo';
COMMENT ON COLUMN sigtap.d_subgrupo.nome IS 'Nome do subgrupo';
COMMENT ON COLUMN sigtap.d_subgrupo.created_at IS 'Data e hora da criação do registro';
COMMENT ON COLUMN sigtap.d_subgrupo.updated_at IS 'Data e hora da última atualização do registro';


-- sigtap.d_forma_organizacao definição

-- Drop table

-- DROP TABLE sigtap.d_forma_organizacao;

CREATE TABLE sigtap.d_forma_organizacao (
	id varchar(6) NOT NULL, -- Chave primária da forma de organização
	"uuid" uuid DEFAULT uuidv7() NOT NULL, -- Identificador único universal
	grupo_id varchar(2) NOT NULL, -- Chave estrangeira referenciando o grupo
	subgrupo_id varchar(4) NOT NULL, -- Chave estrangeira referenciando o subgrupo
	nome varchar(100) NOT NULL, -- Nome da forma de organização
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da criação do registro
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da última atualização do registro
	CONSTRAINT d_forma_organizacao_pkey PRIMARY KEY (id),
	CONSTRAINT fk_dforma_organizacao_dgrupo FOREIGN KEY (grupo_id) REFERENCES sigtap.d_grupo(id),
	CONSTRAINT fk_dforma_organizacao_dsubgrupo FOREIGN KEY (subgrupo_id) REFERENCES sigtap.d_subgrupo(id)
);
CREATE INDEX idx_dformaorganizacao_grupoid ON sigtap.d_forma_organizacao USING btree (grupo_id);
CREATE INDEX idx_dformaorganizacao_subgrupoid ON sigtap.d_forma_organizacao USING btree (subgrupo_id);
CREATE UNIQUE INDEX idx_dformaorganizacao_uuid ON sigtap.d_forma_organizacao USING btree (uuid);

-- Column comments

COMMENT ON COLUMN sigtap.d_forma_organizacao.id IS 'Chave primária da forma de organização';
COMMENT ON COLUMN sigtap.d_forma_organizacao."uuid" IS 'Identificador único universal';
COMMENT ON COLUMN sigtap.d_forma_organizacao.grupo_id IS 'Chave estrangeira referenciando o grupo';
COMMENT ON COLUMN sigtap.d_forma_organizacao.subgrupo_id IS 'Chave estrangeira referenciando o subgrupo';
COMMENT ON COLUMN sigtap.d_forma_organizacao.nome IS 'Nome da forma de organização';
COMMENT ON COLUMN sigtap.d_forma_organizacao.created_at IS 'Data e hora da criação do registro';
COMMENT ON COLUMN sigtap.d_forma_organizacao.updated_at IS 'Data e hora da última atualização do registro';


-- sigtap.d_procedimento definição

-- Drop table

-- DROP TABLE sigtap.d_procedimento;

CREATE TABLE sigtap.d_procedimento (
	id bigserial NOT NULL, -- Chave primária do procedimento
	"uuid" uuid DEFAULT uuidv7() NOT NULL, -- Identificador único universal
	competencia_id int4 NOT NULL, -- Chave estrangeira referenciando a competência
	grupo_id varchar(2) NOT NULL, -- Chave estrangeira referenciando o grupo
	subgrupo_id varchar(4) NOT NULL, -- Chave estrangeira referenciando o subgrupo
	forma_organizacao_id varchar(6) NOT NULL, -- Chave estrangeira referenciando a forma de organização
	financiamento_id varchar(2) NOT NULL, -- Chave estrangeira referenciando o financiamento
	complexidade_id int4 NOT NULL, -- Complexidade do procedimento (0: Não se aplica, 1: Atenção Básica, 2: Média Complexidade, 3: Alta Complexidade)
	sexo_id varchar(1) NOT NULL, -- Sexo para os quais o procedimento é válido
	codigo varchar(10) NOT NULL, -- Código do procedimento
	nome varchar(250) NOT NULL, -- Nome do procedimento
	quantidade_maxima_execucacao int4 NOT NULL, -- Quantidade máxima de execuções permitidas, 9999 se não se aplica
	quantidade_dias_permanencia int4 NOT NULL, -- Quantidade máxima de dias de internações possíveis, 9999 se não se aplica
	quantidade_pontos int4 NOT NULL, -- Quantidade de pontos atribuídos ao procedimento, 9999 se não se aplica
	idade_minima int4 NOT NULL, -- Idade mínima permitida para realização do procediment. De 0000 a 1331 meses. 9999 se não se aplica.
	idade_maxima int4 NOT NULL, -- Idade máxima permitida para realização do procedimento. De 0000 a 1331 meses. 9999 se não se aplica.
	valor_servico_ambulatorial numeric(10, 2) NOT NULL, -- Valor do serviço ambulatorial
	valor_servico_hospitalar numeric(10, 2) NOT NULL, -- Valor do serviço hospitalar
	valor_servico_profissional numeric(10, 2) NOT NULL, -- Valor do serviço profissional
	valor_total_servico_hospitalar numeric(10, 2) NOT NULL, -- Valor total do serviço hospitalar (serviço hospitalar + serviço profissional)
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da criação do registro
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da última atualização do registro
	CONSTRAINT d_procedimento_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_dprocedimento_codigo ON sigtap.d_procedimento USING btree (codigo);
CREATE UNIQUE INDEX idx_dprocedimento_competenciacodigo ON sigtap.d_procedimento USING btree (competencia_id, codigo);
CREATE INDEX idx_dprocedimento_competenciaid ON sigtap.d_procedimento USING btree (competencia_id);
CREATE INDEX idx_dprocedimento_complexidadeid ON sigtap.d_procedimento USING btree (complexidade_id);
CREATE INDEX idx_dprocedimento_financiamentoid ON sigtap.d_procedimento USING btree (financiamento_id);
CREATE INDEX idx_dprocedimento_formaorganizacaoid ON sigtap.d_procedimento USING btree (forma_organizacao_id);
CREATE INDEX idx_dprocedimento_grupoid ON sigtap.d_procedimento USING btree (grupo_id);
CREATE INDEX idx_dprocedimento_sexoid ON sigtap.d_procedimento USING btree (sexo_id);
CREATE INDEX idx_dprocedimento_subgrupoid ON sigtap.d_procedimento USING btree (subgrupo_id);
CREATE INDEX idx_dprocedimento_uuid ON sigtap.d_procedimento USING btree (uuid);

-- Column comments

COMMENT ON COLUMN sigtap.d_procedimento.id IS 'Chave primária do procedimento';
COMMENT ON COLUMN sigtap.d_procedimento."uuid" IS 'Identificador único universal';
COMMENT ON COLUMN sigtap.d_procedimento.competencia_id IS 'Chave estrangeira referenciando a competência';
COMMENT ON COLUMN sigtap.d_procedimento.grupo_id IS 'Chave estrangeira referenciando o grupo';
COMMENT ON COLUMN sigtap.d_procedimento.subgrupo_id IS 'Chave estrangeira referenciando o subgrupo';
COMMENT ON COLUMN sigtap.d_procedimento.forma_organizacao_id IS 'Chave estrangeira referenciando a forma de organização';
COMMENT ON COLUMN sigtap.d_procedimento.financiamento_id IS 'Chave estrangeira referenciando o financiamento';
COMMENT ON COLUMN sigtap.d_procedimento.complexidade_id IS 'Complexidade do procedimento (0: Não se aplica, 1: Atenção Básica, 2: Média Complexidade, 3: Alta Complexidade)';
COMMENT ON COLUMN sigtap.d_procedimento.sexo_id IS 'Sexo para os quais o procedimento é válido';
COMMENT ON COLUMN sigtap.d_procedimento.codigo IS 'Código do procedimento';
COMMENT ON COLUMN sigtap.d_procedimento.nome IS 'Nome do procedimento';
COMMENT ON COLUMN sigtap.d_procedimento.quantidade_maxima_execucacao IS 'Quantidade máxima de execuções permitidas, 9999 se não se aplica';
COMMENT ON COLUMN sigtap.d_procedimento.quantidade_dias_permanencia IS 'Quantidade máxima de dias de internações possíveis, 9999 se não se aplica';
COMMENT ON COLUMN sigtap.d_procedimento.quantidade_pontos IS 'Quantidade de pontos atribuídos ao procedimento, 9999 se não se aplica';
COMMENT ON COLUMN sigtap.d_procedimento.idade_minima IS 'Idade mínima permitida para realização do procediment. De 0000 a 1331 meses. 9999 se não se aplica.';
COMMENT ON COLUMN sigtap.d_procedimento.idade_maxima IS 'Idade máxima permitida para realização do procedimento. De 0000 a 1331 meses. 9999 se não se aplica.';
COMMENT ON COLUMN sigtap.d_procedimento.valor_servico_ambulatorial IS 'Valor do serviço ambulatorial';
COMMENT ON COLUMN sigtap.d_procedimento.valor_servico_hospitalar IS 'Valor do serviço hospitalar';
COMMENT ON COLUMN sigtap.d_procedimento.valor_servico_profissional IS 'Valor do serviço profissional';
COMMENT ON COLUMN sigtap.d_procedimento.valor_total_servico_hospitalar IS 'Valor total do serviço hospitalar (serviço hospitalar + serviço profissional)';
COMMENT ON COLUMN sigtap.d_procedimento.created_at IS 'Data e hora da criação do registro';
COMMENT ON COLUMN sigtap.d_procedimento.updated_at IS 'Data e hora da última atualização do registro';


-- sigtap.f_procedimento_detalhe definição

-- Drop table

-- DROP TABLE sigtap.f_procedimento_detalhe;

CREATE TABLE sigtap.f_procedimento_detalhe (
	"uuid" uuid DEFAULT uuidv7() NOT NULL, -- Identificador único universal
	procedimento_id int8 NOT NULL, -- Chave estrangeira para o procedimento
	detalhe_id int4 NOT NULL, -- Chave estrangeira para o detalhe
	competencia_id int4 NOT NULL, -- Competência de vigência do detalhe no procedimento
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL, -- Data e hora da criação do registro
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL -- Data e hora da última atualização do registro
);
CREATE INDEX idx_fprocedimentodetalhe_detalheid ON sigtap.f_procedimento_detalhe USING btree (detalhe_id);
CREATE INDEX idx_fprocedimentodetalhe_procedimentoid ON sigtap.f_procedimento_detalhe USING btree (procedimento_id);
CREATE UNIQUE INDEX idx_fprocedimentodetalhe_procedimentoidetalheidcompetenciaid ON sigtap.f_procedimento_detalhe USING btree (procedimento_id, detalhe_id, competencia_id);
CREATE INDEX idx_fprocedimentodetalhe_uuid ON sigtap.f_procedimento_detalhe USING btree (uuid);

-- Column comments

COMMENT ON COLUMN sigtap.f_procedimento_detalhe."uuid" IS 'Identificador único universal';
COMMENT ON COLUMN sigtap.f_procedimento_detalhe.procedimento_id IS 'Chave estrangeira para o procedimento';
COMMENT ON COLUMN sigtap.f_procedimento_detalhe.detalhe_id IS 'Chave estrangeira para o detalhe';
COMMENT ON COLUMN sigtap.f_procedimento_detalhe.competencia_id IS 'Competência de vigência do detalhe no procedimento';
COMMENT ON COLUMN sigtap.f_procedimento_detalhe.created_at IS 'Data e hora da criação do registro';
COMMENT ON COLUMN sigtap.f_procedimento_detalhe.updated_at IS 'Data e hora da última atualização do registro';


-- sigtap.d_procedimento chaves estrangeiras

ALTER TABLE sigtap.d_procedimento ADD CONSTRAINT fk_dprocedimento_complexidade FOREIGN KEY (complexidade_id) REFERENCES sigtap.d_complexidade(id);
ALTER TABLE sigtap.d_procedimento ADD CONSTRAINT fk_dprocedimento_dcompetencia FOREIGN KEY (competencia_id) REFERENCES public.d_competencia(id);
ALTER TABLE sigtap.d_procedimento ADD CONSTRAINT fk_dprocedimento_financiamento FOREIGN KEY (financiamento_id) REFERENCES sigtap.d_financiamento(id);
ALTER TABLE sigtap.d_procedimento ADD CONSTRAINT fk_dprocedimento_formaorganizacao FOREIGN KEY (forma_organizacao_id) REFERENCES sigtap.d_forma_organizacao(id);
ALTER TABLE sigtap.d_procedimento ADD CONSTRAINT fk_dprocedimento_grupo FOREIGN KEY (grupo_id) REFERENCES sigtap.d_grupo(id);
ALTER TABLE sigtap.d_procedimento ADD CONSTRAINT fk_dprocedimento_sexo FOREIGN KEY (sexo_id) REFERENCES public.d_sexo(id);
ALTER TABLE sigtap.d_procedimento ADD CONSTRAINT fk_dprocedimento_subgrupo FOREIGN KEY (subgrupo_id) REFERENCES sigtap.d_subgrupo(id);


-- sigtap.f_procedimento_detalhe chaves estrangeiras

ALTER TABLE sigtap.f_procedimento_detalhe ADD CONSTRAINT fk_fprocedimentodetalhe_competencia FOREIGN KEY (competencia_id) REFERENCES public.d_competencia(id);
ALTER TABLE sigtap.f_procedimento_detalhe ADD CONSTRAINT fk_fprocedimentodetalhe_detalhe FOREIGN KEY (detalhe_id) REFERENCES sigtap.d_detalhe(id);
ALTER TABLE sigtap.f_procedimento_detalhe ADD CONSTRAINT fk_fprocedimentodetalhe_procedimento FOREIGN KEY (procedimento_id) REFERENCES sigtap.d_procedimento(id);