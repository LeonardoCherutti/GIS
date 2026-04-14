-- DROP SCHEMA siasus;

CREATE SCHEMA siasus AUTHORIZATION postgres;
-- siasus.f_producao_ambulatorial definição

-- Drop table

-- DROP TABLE siasus.f_producao_ambulatorial;

CREATE TABLE siasus.f_producao_ambulatorial (
	"uuid" uuid DEFAULT uuidv7() NOT NULL,
	uf_id int4 NOT NULL,
	municipio_id int8 NOT NULL,
	cnes_estabelecimento_id int8 NOT NULL,
	competencia_processamento_id int4 NOT NULL,
	competencia_realizacao_id int4 NOT NULL,
	sigtap_procedimento_id int8 NOT NULL,
	sexo_id varchar(1) NOT NULL,
	tipo_gestao varchar(2) NOT NULL,
	codigo_regra_contratual varchar(4) NULL,
	incremento_outros varchar(4) NULL,
	incremento_urgencia varchar(4) NULL,
	tipo_estabelecimento varchar(2) NOT NULL,
	tipo_prestador varchar(2) NOT NULL,
	mantido_individual varchar(1) NOT NULL,
	cnpj_estabelecimento_executante varchar(14) NOT NULL,
	cnpj_mantenedora varchar(14) NULL,
	cnpj_orgao_producao varchar(14) NULL,
	tipo_financiamento varchar(2) NOT NULL,
	subtipo_financiamento varchar(4) NULL,
	instrumento_registro varchar(1) NOT NULL,
	autorizacao varchar(13) NULL,
	cns_profissional varchar(15) NULL,
	cbo_profissional varchar(6) NULL,
	motivo_saida varchar(2) NULL,
	indicador_obito varchar(1) NOT NULL,
	indicador_encerramento varchar(1) NOT NULL,
	indicador_permanencia varchar(1) NOT NULL,
	indicador_alta varchar(1) NOT NULL,
	indicador_transferencia varchar(1) NOT NULL,
	cid_principal varchar(4) NULL,
	cid_secundario varchar(4) NULL,
	cid_causas_associadas varchar(4) NULL,
	carater_atendimento varchar(2) NOT NULL,
	idade varchar(3) NOT NULL,
	compatibilidade_faixa_idade varchar(1) NOT NULL,
	idade_minima varchar(3) NULL,
	idade_maxima varchar(3) NULL,
	racacor varchar(2) NOT NULL,
	uf_municipio_residencia_paciente varchar(6) NOT NULL,
	quantidade_produzida numeric(11) NOT NULL,
	quantidade_aprovada numeric(11) NOT NULL,
	valor_produzido numeric(20, 2) NOT NULL,
	valor_aprovado numeric(20, 2) NOT NULL,
	uf_diferente_residencia_paciente varchar(1) NOT NULL,
	municipio_diferente_residencia_paciente varchar(1) NOT NULL,
	diferenca_valor_unitario numeric(20, 2) NOT NULL,
	valor_unitario_procedimento_vpa numeric(20, 2) NOT NULL,
	valor_unitario_procedimento_sigtap numeric(20, 2) NOT NULL,
	indicativo_situacao_producao_produzida varchar(1) NOT NULL,
	codigo_ocorrencia varchar(1) NOT NULL,
	indicador_erro_quantidade_produzida varchar(1) NOT NULL,
	indicador_erro_corpo_apac varchar(1) NOT NULL,
	etnia_paciente varchar(4) NULL,
	valor_complemento_federal numeric(20, 2) NOT NULL,
	valor_complemento_local numeric(20, 2) NOT NULL,
	valor_incremento numeric(20, 2) NOT NULL,
	codigo_servico_especializado_classificacao_cbo varchar(6) NULL,
	codigo_identificacao_nacional_equipes varchar(10) NULL,
	codigo_natureza_juridica varchar(4) NOT NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
)
PARTITION BY RANGE (competencia_processamento_id);
CREATE INDEX idx_fproducaoambulatorial_cidcausasassociadas ON ONLY siasus.f_producao_ambulatorial USING btree (cid_causas_associadas);
CREATE INDEX idx_fproducaoambulatorial_cidprincipal ON ONLY siasus.f_producao_ambulatorial USING btree (cid_principal);
CREATE INDEX idx_fproducaoambulatorial_cidsecundario ON ONLY siasus.f_producao_ambulatorial USING btree (cid_secundario);
CREATE INDEX idx_fproducaoambulatorial_cnesestabelecimentoid ON ONLY siasus.f_producao_ambulatorial USING btree (cnes_estabelecimento_id);
CREATE INDEX idx_fproducaoambulatorial_competenciaprocessamentoid ON ONLY siasus.f_producao_ambulatorial USING btree (competencia_processamento_id);
CREATE INDEX idx_fproducaoambulatorial_competenciarealizacaoid ON ONLY siasus.f_producao_ambulatorial USING btree (competencia_realizacao_id);
CREATE INDEX idx_fproducaoambulatorial_municipioid ON ONLY siasus.f_producao_ambulatorial USING btree (municipio_id);
CREATE INDEX idx_fproducaoambulatorial_sexoid ON ONLY siasus.f_producao_ambulatorial USING btree (sexo_id);
CREATE INDEX idx_fproducaoambulatorial_sigtapprocedimentoid ON ONLY siasus.f_producao_ambulatorial USING btree (sigtap_procedimento_id);
CREATE INDEX idx_fproducaoambulatorial_ufid ON ONLY siasus.f_producao_ambulatorial USING btree (uf_id);
CREATE INDEX idx_fproducaoambulatorial_uuid ON ONLY siasus.f_producao_ambulatorial USING btree (uuid);


-- siasus.f_producao_ambulatorial_2021_01 definição

CREATE TABLE siasus.f_producao_ambulatorial_2021_01 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202101) TO (202102);
CREATE INDEX f_producao_ambulatorial_2021_01_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2021_01 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2021_01_cid_principal_idx ON siasus.f_producao_ambulatorial_2021_01 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2021_01_cid_secundario_idx ON siasus.f_producao_ambulatorial_2021_01 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2021_01_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2021_01 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2021_01_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2021_01 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2021_01_municipio_id_idx ON siasus.f_producao_ambulatorial_2021_01 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2021_01_sexo_id_idx ON siasus.f_producao_ambulatorial_2021_01 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2021_01_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2021_01 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2021_01_uf_id_idx ON siasus.f_producao_ambulatorial_2021_01 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2021_01_uuid_idx ON siasus.f_producao_ambulatorial_2021_01 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2021_0_competencia_processamento_id_idx ON siasus.f_producao_ambulatorial_2021_01 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2021_02 definição

CREATE TABLE siasus.f_producao_ambulatorial_2021_02 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202102) TO (202103);
CREATE INDEX f_producao_ambulatorial_2021_02_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2021_02 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2021_02_cid_principal_idx ON siasus.f_producao_ambulatorial_2021_02 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2021_02_cid_secundario_idx ON siasus.f_producao_ambulatorial_2021_02 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2021_02_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2021_02 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2021_02_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2021_02 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2021_02_municipio_id_idx ON siasus.f_producao_ambulatorial_2021_02 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2021_02_sexo_id_idx ON siasus.f_producao_ambulatorial_2021_02 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2021_02_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2021_02 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2021_02_uf_id_idx ON siasus.f_producao_ambulatorial_2021_02 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2021_02_uuid_idx ON siasus.f_producao_ambulatorial_2021_02 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2021__competencia_processamento_id_idx1 ON siasus.f_producao_ambulatorial_2021_02 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2021_03 definição

CREATE TABLE siasus.f_producao_ambulatorial_2021_03 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202103) TO (202104);
CREATE INDEX f_producao_ambulatorial_2021_03_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2021_03 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2021_03_cid_principal_idx ON siasus.f_producao_ambulatorial_2021_03 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2021_03_cid_secundario_idx ON siasus.f_producao_ambulatorial_2021_03 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2021_03_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2021_03 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2021_03_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2021_03 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2021_03_municipio_id_idx ON siasus.f_producao_ambulatorial_2021_03 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2021_03_sexo_id_idx ON siasus.f_producao_ambulatorial_2021_03 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2021_03_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2021_03 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2021_03_uf_id_idx ON siasus.f_producao_ambulatorial_2021_03 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2021_03_uuid_idx ON siasus.f_producao_ambulatorial_2021_03 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2021__competencia_processamento_id_idx2 ON siasus.f_producao_ambulatorial_2021_03 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2021_04 definição

CREATE TABLE siasus.f_producao_ambulatorial_2021_04 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202104) TO (202105);
CREATE INDEX f_producao_ambulatorial_2021_04_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2021_04 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2021_04_cid_principal_idx ON siasus.f_producao_ambulatorial_2021_04 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2021_04_cid_secundario_idx ON siasus.f_producao_ambulatorial_2021_04 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2021_04_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2021_04 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2021_04_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2021_04 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2021_04_municipio_id_idx ON siasus.f_producao_ambulatorial_2021_04 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2021_04_sexo_id_idx ON siasus.f_producao_ambulatorial_2021_04 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2021_04_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2021_04 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2021_04_uf_id_idx ON siasus.f_producao_ambulatorial_2021_04 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2021_04_uuid_idx ON siasus.f_producao_ambulatorial_2021_04 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2021__competencia_processamento_id_idx3 ON siasus.f_producao_ambulatorial_2021_04 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2021_05 definição

CREATE TABLE siasus.f_producao_ambulatorial_2021_05 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202105) TO (202106);
CREATE INDEX f_producao_ambulatorial_2021_05_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2021_05 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2021_05_cid_principal_idx ON siasus.f_producao_ambulatorial_2021_05 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2021_05_cid_secundario_idx ON siasus.f_producao_ambulatorial_2021_05 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2021_05_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2021_05 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2021_05_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2021_05 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2021_05_municipio_id_idx ON siasus.f_producao_ambulatorial_2021_05 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2021_05_sexo_id_idx ON siasus.f_producao_ambulatorial_2021_05 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2021_05_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2021_05 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2021_05_uf_id_idx ON siasus.f_producao_ambulatorial_2021_05 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2021_05_uuid_idx ON siasus.f_producao_ambulatorial_2021_05 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2021__competencia_processamento_id_idx4 ON siasus.f_producao_ambulatorial_2021_05 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2021_06 definição

CREATE TABLE siasus.f_producao_ambulatorial_2021_06 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202106) TO (202107);
CREATE INDEX f_producao_ambulatorial_2021_06_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2021_06 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2021_06_cid_principal_idx ON siasus.f_producao_ambulatorial_2021_06 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2021_06_cid_secundario_idx ON siasus.f_producao_ambulatorial_2021_06 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2021_06_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2021_06 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2021_06_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2021_06 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2021_06_municipio_id_idx ON siasus.f_producao_ambulatorial_2021_06 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2021_06_sexo_id_idx ON siasus.f_producao_ambulatorial_2021_06 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2021_06_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2021_06 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2021_06_uf_id_idx ON siasus.f_producao_ambulatorial_2021_06 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2021_06_uuid_idx ON siasus.f_producao_ambulatorial_2021_06 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2021__competencia_processamento_id_idx5 ON siasus.f_producao_ambulatorial_2021_06 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2021_07 definição

CREATE TABLE siasus.f_producao_ambulatorial_2021_07 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202107) TO (202108);
CREATE INDEX f_producao_ambulatorial_2021_07_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2021_07 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2021_07_cid_principal_idx ON siasus.f_producao_ambulatorial_2021_07 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2021_07_cid_secundario_idx ON siasus.f_producao_ambulatorial_2021_07 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2021_07_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2021_07 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2021_07_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2021_07 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2021_07_municipio_id_idx ON siasus.f_producao_ambulatorial_2021_07 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2021_07_sexo_id_idx ON siasus.f_producao_ambulatorial_2021_07 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2021_07_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2021_07 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2021_07_uf_id_idx ON siasus.f_producao_ambulatorial_2021_07 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2021_07_uuid_idx ON siasus.f_producao_ambulatorial_2021_07 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2021__competencia_processamento_id_idx6 ON siasus.f_producao_ambulatorial_2021_07 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2021_08 definição

CREATE TABLE siasus.f_producao_ambulatorial_2021_08 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202108) TO (202109);
CREATE INDEX f_producao_ambulatorial_2021_08_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2021_08 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2021_08_cid_principal_idx ON siasus.f_producao_ambulatorial_2021_08 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2021_08_cid_secundario_idx ON siasus.f_producao_ambulatorial_2021_08 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2021_08_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2021_08 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2021_08_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2021_08 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2021_08_municipio_id_idx ON siasus.f_producao_ambulatorial_2021_08 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2021_08_sexo_id_idx ON siasus.f_producao_ambulatorial_2021_08 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2021_08_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2021_08 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2021_08_uf_id_idx ON siasus.f_producao_ambulatorial_2021_08 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2021_08_uuid_idx ON siasus.f_producao_ambulatorial_2021_08 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2021__competencia_processamento_id_idx7 ON siasus.f_producao_ambulatorial_2021_08 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2021_09 definição

CREATE TABLE siasus.f_producao_ambulatorial_2021_09 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202109) TO (202110);
CREATE INDEX f_producao_ambulatorial_2021_09_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2021_09 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2021_09_cid_principal_idx ON siasus.f_producao_ambulatorial_2021_09 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2021_09_cid_secundario_idx ON siasus.f_producao_ambulatorial_2021_09 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2021_09_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2021_09 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2021_09_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2021_09 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2021_09_municipio_id_idx ON siasus.f_producao_ambulatorial_2021_09 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2021_09_sexo_id_idx ON siasus.f_producao_ambulatorial_2021_09 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2021_09_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2021_09 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2021_09_uf_id_idx ON siasus.f_producao_ambulatorial_2021_09 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2021_09_uuid_idx ON siasus.f_producao_ambulatorial_2021_09 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2021__competencia_processamento_id_idx8 ON siasus.f_producao_ambulatorial_2021_09 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2021_10 definição

CREATE TABLE siasus.f_producao_ambulatorial_2021_10 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202110) TO (202111);
CREATE INDEX f_producao_ambulatorial_2021_10_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2021_10 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2021_10_cid_principal_idx ON siasus.f_producao_ambulatorial_2021_10 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2021_10_cid_secundario_idx ON siasus.f_producao_ambulatorial_2021_10 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2021_10_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2021_10 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2021_10_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2021_10 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2021_10_municipio_id_idx ON siasus.f_producao_ambulatorial_2021_10 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2021_10_sexo_id_idx ON siasus.f_producao_ambulatorial_2021_10 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2021_10_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2021_10 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2021_10_uf_id_idx ON siasus.f_producao_ambulatorial_2021_10 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2021_10_uuid_idx ON siasus.f_producao_ambulatorial_2021_10 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2021_1_competencia_processamento_id_idx ON siasus.f_producao_ambulatorial_2021_10 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2021_11 definição

CREATE TABLE siasus.f_producao_ambulatorial_2021_11 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202111) TO (202112);
CREATE INDEX f_producao_ambulatorial_2021_11_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2021_11 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2021_11_cid_principal_idx ON siasus.f_producao_ambulatorial_2021_11 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2021_11_cid_secundario_idx ON siasus.f_producao_ambulatorial_2021_11 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2021_11_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2021_11 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2021_11_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2021_11 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2021_11_municipio_id_idx ON siasus.f_producao_ambulatorial_2021_11 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2021_11_sexo_id_idx ON siasus.f_producao_ambulatorial_2021_11 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2021_11_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2021_11 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2021_11_uf_id_idx ON siasus.f_producao_ambulatorial_2021_11 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2021_11_uuid_idx ON siasus.f_producao_ambulatorial_2021_11 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2021__competencia_processamento_id_idx9 ON siasus.f_producao_ambulatorial_2021_11 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2021_12 definição

CREATE TABLE siasus.f_producao_ambulatorial_2021_12 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202112) TO (202201);
CREATE INDEX f_producao_ambulatorial_2021_12_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2021_12 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2021_12_cid_principal_idx ON siasus.f_producao_ambulatorial_2021_12 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2021_12_cid_secundario_idx ON siasus.f_producao_ambulatorial_2021_12 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2021_12_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2021_12 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2021_12_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2021_12 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2021_12_municipio_id_idx ON siasus.f_producao_ambulatorial_2021_12 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2021_12_sexo_id_idx ON siasus.f_producao_ambulatorial_2021_12 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2021_12_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2021_12 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2021_12_uf_id_idx ON siasus.f_producao_ambulatorial_2021_12 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2021_12_uuid_idx ON siasus.f_producao_ambulatorial_2021_12 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2021_competencia_processamento_id_idx10 ON siasus.f_producao_ambulatorial_2021_12 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2022_01 definição

CREATE TABLE siasus.f_producao_ambulatorial_2022_01 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202201) TO (202202);
CREATE INDEX f_producao_ambulatorial_2022_01_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2022_01 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2022_01_cid_principal_idx ON siasus.f_producao_ambulatorial_2022_01 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2022_01_cid_secundario_idx ON siasus.f_producao_ambulatorial_2022_01 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2022_01_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2022_01 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2022_01_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2022_01 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2022_01_municipio_id_idx ON siasus.f_producao_ambulatorial_2022_01 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2022_01_sexo_id_idx ON siasus.f_producao_ambulatorial_2022_01 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2022_01_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2022_01 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2022_01_uf_id_idx ON siasus.f_producao_ambulatorial_2022_01 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2022_01_uuid_idx ON siasus.f_producao_ambulatorial_2022_01 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2022_0_competencia_processamento_id_idx ON siasus.f_producao_ambulatorial_2022_01 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2022_02 definição

CREATE TABLE siasus.f_producao_ambulatorial_2022_02 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202202) TO (202203);
CREATE INDEX f_producao_ambulatorial_2022_02_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2022_02 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2022_02_cid_principal_idx ON siasus.f_producao_ambulatorial_2022_02 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2022_02_cid_secundario_idx ON siasus.f_producao_ambulatorial_2022_02 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2022_02_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2022_02 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2022_02_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2022_02 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2022_02_municipio_id_idx ON siasus.f_producao_ambulatorial_2022_02 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2022_02_sexo_id_idx ON siasus.f_producao_ambulatorial_2022_02 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2022_02_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2022_02 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2022_02_uf_id_idx ON siasus.f_producao_ambulatorial_2022_02 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2022_02_uuid_idx ON siasus.f_producao_ambulatorial_2022_02 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2022__competencia_processamento_id_idx1 ON siasus.f_producao_ambulatorial_2022_02 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2022_03 definição

CREATE TABLE siasus.f_producao_ambulatorial_2022_03 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202203) TO (202204);
CREATE INDEX f_producao_ambulatorial_2022_03_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2022_03 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2022_03_cid_principal_idx ON siasus.f_producao_ambulatorial_2022_03 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2022_03_cid_secundario_idx ON siasus.f_producao_ambulatorial_2022_03 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2022_03_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2022_03 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2022_03_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2022_03 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2022_03_municipio_id_idx ON siasus.f_producao_ambulatorial_2022_03 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2022_03_sexo_id_idx ON siasus.f_producao_ambulatorial_2022_03 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2022_03_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2022_03 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2022_03_uf_id_idx ON siasus.f_producao_ambulatorial_2022_03 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2022_03_uuid_idx ON siasus.f_producao_ambulatorial_2022_03 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2022__competencia_processamento_id_idx2 ON siasus.f_producao_ambulatorial_2022_03 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2022_04 definição

CREATE TABLE siasus.f_producao_ambulatorial_2022_04 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202204) TO (202205);
CREATE INDEX f_producao_ambulatorial_2022_04_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2022_04 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2022_04_cid_principal_idx ON siasus.f_producao_ambulatorial_2022_04 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2022_04_cid_secundario_idx ON siasus.f_producao_ambulatorial_2022_04 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2022_04_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2022_04 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2022_04_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2022_04 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2022_04_municipio_id_idx ON siasus.f_producao_ambulatorial_2022_04 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2022_04_sexo_id_idx ON siasus.f_producao_ambulatorial_2022_04 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2022_04_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2022_04 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2022_04_uf_id_idx ON siasus.f_producao_ambulatorial_2022_04 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2022_04_uuid_idx ON siasus.f_producao_ambulatorial_2022_04 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2022__competencia_processamento_id_idx3 ON siasus.f_producao_ambulatorial_2022_04 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2022_05 definição

CREATE TABLE siasus.f_producao_ambulatorial_2022_05 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202205) TO (202206);
CREATE INDEX f_producao_ambulatorial_2022_05_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2022_05 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2022_05_cid_principal_idx ON siasus.f_producao_ambulatorial_2022_05 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2022_05_cid_secundario_idx ON siasus.f_producao_ambulatorial_2022_05 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2022_05_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2022_05 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2022_05_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2022_05 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2022_05_municipio_id_idx ON siasus.f_producao_ambulatorial_2022_05 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2022_05_sexo_id_idx ON siasus.f_producao_ambulatorial_2022_05 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2022_05_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2022_05 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2022_05_uf_id_idx ON siasus.f_producao_ambulatorial_2022_05 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2022_05_uuid_idx ON siasus.f_producao_ambulatorial_2022_05 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2022__competencia_processamento_id_idx4 ON siasus.f_producao_ambulatorial_2022_05 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2022_06 definição

CREATE TABLE siasus.f_producao_ambulatorial_2022_06 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202206) TO (202207);
CREATE INDEX f_producao_ambulatorial_2022_06_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2022_06 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2022_06_cid_principal_idx ON siasus.f_producao_ambulatorial_2022_06 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2022_06_cid_secundario_idx ON siasus.f_producao_ambulatorial_2022_06 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2022_06_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2022_06 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2022_06_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2022_06 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2022_06_municipio_id_idx ON siasus.f_producao_ambulatorial_2022_06 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2022_06_sexo_id_idx ON siasus.f_producao_ambulatorial_2022_06 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2022_06_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2022_06 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2022_06_uf_id_idx ON siasus.f_producao_ambulatorial_2022_06 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2022_06_uuid_idx ON siasus.f_producao_ambulatorial_2022_06 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2022__competencia_processamento_id_idx5 ON siasus.f_producao_ambulatorial_2022_06 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2022_07 definição

CREATE TABLE siasus.f_producao_ambulatorial_2022_07 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202207) TO (202208);
CREATE INDEX f_producao_ambulatorial_2022_07_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2022_07 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2022_07_cid_principal_idx ON siasus.f_producao_ambulatorial_2022_07 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2022_07_cid_secundario_idx ON siasus.f_producao_ambulatorial_2022_07 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2022_07_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2022_07 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2022_07_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2022_07 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2022_07_municipio_id_idx ON siasus.f_producao_ambulatorial_2022_07 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2022_07_sexo_id_idx ON siasus.f_producao_ambulatorial_2022_07 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2022_07_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2022_07 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2022_07_uf_id_idx ON siasus.f_producao_ambulatorial_2022_07 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2022_07_uuid_idx ON siasus.f_producao_ambulatorial_2022_07 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2022__competencia_processamento_id_idx6 ON siasus.f_producao_ambulatorial_2022_07 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2022_08 definição

CREATE TABLE siasus.f_producao_ambulatorial_2022_08 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202208) TO (202209);
CREATE INDEX f_producao_ambulatorial_2022_08_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2022_08 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2022_08_cid_principal_idx ON siasus.f_producao_ambulatorial_2022_08 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2022_08_cid_secundario_idx ON siasus.f_producao_ambulatorial_2022_08 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2022_08_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2022_08 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2022_08_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2022_08 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2022_08_municipio_id_idx ON siasus.f_producao_ambulatorial_2022_08 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2022_08_sexo_id_idx ON siasus.f_producao_ambulatorial_2022_08 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2022_08_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2022_08 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2022_08_uf_id_idx ON siasus.f_producao_ambulatorial_2022_08 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2022_08_uuid_idx ON siasus.f_producao_ambulatorial_2022_08 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2022__competencia_processamento_id_idx7 ON siasus.f_producao_ambulatorial_2022_08 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2022_09 definição

CREATE TABLE siasus.f_producao_ambulatorial_2022_09 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202209) TO (202210);
CREATE INDEX f_producao_ambulatorial_2022_09_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2022_09 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2022_09_cid_principal_idx ON siasus.f_producao_ambulatorial_2022_09 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2022_09_cid_secundario_idx ON siasus.f_producao_ambulatorial_2022_09 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2022_09_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2022_09 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2022_09_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2022_09 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2022_09_municipio_id_idx ON siasus.f_producao_ambulatorial_2022_09 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2022_09_sexo_id_idx ON siasus.f_producao_ambulatorial_2022_09 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2022_09_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2022_09 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2022_09_uf_id_idx ON siasus.f_producao_ambulatorial_2022_09 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2022_09_uuid_idx ON siasus.f_producao_ambulatorial_2022_09 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2022__competencia_processamento_id_idx8 ON siasus.f_producao_ambulatorial_2022_09 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2022_10 definição

CREATE TABLE siasus.f_producao_ambulatorial_2022_10 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202210) TO (202211);
CREATE INDEX f_producao_ambulatorial_2022_10_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2022_10 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2022_10_cid_principal_idx ON siasus.f_producao_ambulatorial_2022_10 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2022_10_cid_secundario_idx ON siasus.f_producao_ambulatorial_2022_10 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2022_10_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2022_10 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2022_10_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2022_10 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2022_10_municipio_id_idx ON siasus.f_producao_ambulatorial_2022_10 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2022_10_sexo_id_idx ON siasus.f_producao_ambulatorial_2022_10 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2022_10_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2022_10 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2022_10_uf_id_idx ON siasus.f_producao_ambulatorial_2022_10 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2022_10_uuid_idx ON siasus.f_producao_ambulatorial_2022_10 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2022_1_competencia_processamento_id_idx ON siasus.f_producao_ambulatorial_2022_10 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2022_11 definição

CREATE TABLE siasus.f_producao_ambulatorial_2022_11 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202211) TO (202212);
CREATE INDEX f_producao_ambulatorial_2022_11_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2022_11 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2022_11_cid_principal_idx ON siasus.f_producao_ambulatorial_2022_11 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2022_11_cid_secundario_idx ON siasus.f_producao_ambulatorial_2022_11 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2022_11_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2022_11 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2022_11_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2022_11 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2022_11_municipio_id_idx ON siasus.f_producao_ambulatorial_2022_11 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2022_11_sexo_id_idx ON siasus.f_producao_ambulatorial_2022_11 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2022_11_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2022_11 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2022_11_uf_id_idx ON siasus.f_producao_ambulatorial_2022_11 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2022_11_uuid_idx ON siasus.f_producao_ambulatorial_2022_11 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2022__competencia_processamento_id_idx9 ON siasus.f_producao_ambulatorial_2022_11 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2022_12 definição

CREATE TABLE siasus.f_producao_ambulatorial_2022_12 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202212) TO (202301);
CREATE INDEX f_producao_ambulatorial_2022_12_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2022_12 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2022_12_cid_principal_idx ON siasus.f_producao_ambulatorial_2022_12 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2022_12_cid_secundario_idx ON siasus.f_producao_ambulatorial_2022_12 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2022_12_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2022_12 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2022_12_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2022_12 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2022_12_municipio_id_idx ON siasus.f_producao_ambulatorial_2022_12 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2022_12_sexo_id_idx ON siasus.f_producao_ambulatorial_2022_12 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2022_12_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2022_12 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2022_12_uf_id_idx ON siasus.f_producao_ambulatorial_2022_12 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2022_12_uuid_idx ON siasus.f_producao_ambulatorial_2022_12 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2022_competencia_processamento_id_idx10 ON siasus.f_producao_ambulatorial_2022_12 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2023_01 definição

CREATE TABLE siasus.f_producao_ambulatorial_2023_01 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202301) TO (202302);
CREATE INDEX f_producao_ambulatorial_2023_01_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2023_01 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2023_01_cid_principal_idx ON siasus.f_producao_ambulatorial_2023_01 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2023_01_cid_secundario_idx ON siasus.f_producao_ambulatorial_2023_01 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2023_01_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2023_01 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2023_01_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2023_01 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2023_01_municipio_id_idx ON siasus.f_producao_ambulatorial_2023_01 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2023_01_sexo_id_idx ON siasus.f_producao_ambulatorial_2023_01 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2023_01_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2023_01 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2023_01_uf_id_idx ON siasus.f_producao_ambulatorial_2023_01 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2023_01_uuid_idx ON siasus.f_producao_ambulatorial_2023_01 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2023_0_competencia_processamento_id_idx ON siasus.f_producao_ambulatorial_2023_01 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2023_02 definição

CREATE TABLE siasus.f_producao_ambulatorial_2023_02 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202302) TO (202303);
CREATE INDEX f_producao_ambulatorial_2023_02_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2023_02 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2023_02_cid_principal_idx ON siasus.f_producao_ambulatorial_2023_02 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2023_02_cid_secundario_idx ON siasus.f_producao_ambulatorial_2023_02 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2023_02_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2023_02 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2023_02_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2023_02 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2023_02_municipio_id_idx ON siasus.f_producao_ambulatorial_2023_02 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2023_02_sexo_id_idx ON siasus.f_producao_ambulatorial_2023_02 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2023_02_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2023_02 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2023_02_uf_id_idx ON siasus.f_producao_ambulatorial_2023_02 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2023_02_uuid_idx ON siasus.f_producao_ambulatorial_2023_02 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2023__competencia_processamento_id_idx1 ON siasus.f_producao_ambulatorial_2023_02 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2023_03 definição

CREATE TABLE siasus.f_producao_ambulatorial_2023_03 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202303) TO (202304);
CREATE INDEX f_producao_ambulatorial_2023_03_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2023_03 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2023_03_cid_principal_idx ON siasus.f_producao_ambulatorial_2023_03 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2023_03_cid_secundario_idx ON siasus.f_producao_ambulatorial_2023_03 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2023_03_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2023_03 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2023_03_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2023_03 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2023_03_municipio_id_idx ON siasus.f_producao_ambulatorial_2023_03 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2023_03_sexo_id_idx ON siasus.f_producao_ambulatorial_2023_03 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2023_03_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2023_03 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2023_03_uf_id_idx ON siasus.f_producao_ambulatorial_2023_03 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2023_03_uuid_idx ON siasus.f_producao_ambulatorial_2023_03 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2023__competencia_processamento_id_idx2 ON siasus.f_producao_ambulatorial_2023_03 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2023_04 definição

CREATE TABLE siasus.f_producao_ambulatorial_2023_04 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202304) TO (202305);
CREATE INDEX f_producao_ambulatorial_2023_04_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2023_04 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2023_04_cid_principal_idx ON siasus.f_producao_ambulatorial_2023_04 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2023_04_cid_secundario_idx ON siasus.f_producao_ambulatorial_2023_04 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2023_04_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2023_04 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2023_04_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2023_04 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2023_04_municipio_id_idx ON siasus.f_producao_ambulatorial_2023_04 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2023_04_sexo_id_idx ON siasus.f_producao_ambulatorial_2023_04 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2023_04_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2023_04 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2023_04_uf_id_idx ON siasus.f_producao_ambulatorial_2023_04 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2023_04_uuid_idx ON siasus.f_producao_ambulatorial_2023_04 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2023__competencia_processamento_id_idx3 ON siasus.f_producao_ambulatorial_2023_04 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2023_05 definição

CREATE TABLE siasus.f_producao_ambulatorial_2023_05 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202305) TO (202306);
CREATE INDEX f_producao_ambulatorial_2023_05_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2023_05 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2023_05_cid_principal_idx ON siasus.f_producao_ambulatorial_2023_05 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2023_05_cid_secundario_idx ON siasus.f_producao_ambulatorial_2023_05 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2023_05_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2023_05 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2023_05_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2023_05 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2023_05_municipio_id_idx ON siasus.f_producao_ambulatorial_2023_05 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2023_05_sexo_id_idx ON siasus.f_producao_ambulatorial_2023_05 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2023_05_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2023_05 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2023_05_uf_id_idx ON siasus.f_producao_ambulatorial_2023_05 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2023_05_uuid_idx ON siasus.f_producao_ambulatorial_2023_05 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2023__competencia_processamento_id_idx4 ON siasus.f_producao_ambulatorial_2023_05 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2023_06 definição

CREATE TABLE siasus.f_producao_ambulatorial_2023_06 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202306) TO (202307);
CREATE INDEX f_producao_ambulatorial_2023_06_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2023_06 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2023_06_cid_principal_idx ON siasus.f_producao_ambulatorial_2023_06 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2023_06_cid_secundario_idx ON siasus.f_producao_ambulatorial_2023_06 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2023_06_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2023_06 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2023_06_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2023_06 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2023_06_municipio_id_idx ON siasus.f_producao_ambulatorial_2023_06 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2023_06_sexo_id_idx ON siasus.f_producao_ambulatorial_2023_06 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2023_06_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2023_06 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2023_06_uf_id_idx ON siasus.f_producao_ambulatorial_2023_06 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2023_06_uuid_idx ON siasus.f_producao_ambulatorial_2023_06 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2023__competencia_processamento_id_idx5 ON siasus.f_producao_ambulatorial_2023_06 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2023_07 definição

CREATE TABLE siasus.f_producao_ambulatorial_2023_07 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202307) TO (202308);
CREATE INDEX f_producao_ambulatorial_2023_07_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2023_07 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2023_07_cid_principal_idx ON siasus.f_producao_ambulatorial_2023_07 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2023_07_cid_secundario_idx ON siasus.f_producao_ambulatorial_2023_07 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2023_07_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2023_07 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2023_07_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2023_07 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2023_07_municipio_id_idx ON siasus.f_producao_ambulatorial_2023_07 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2023_07_sexo_id_idx ON siasus.f_producao_ambulatorial_2023_07 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2023_07_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2023_07 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2023_07_uf_id_idx ON siasus.f_producao_ambulatorial_2023_07 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2023_07_uuid_idx ON siasus.f_producao_ambulatorial_2023_07 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2023__competencia_processamento_id_idx6 ON siasus.f_producao_ambulatorial_2023_07 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2023_08 definição

CREATE TABLE siasus.f_producao_ambulatorial_2023_08 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202308) TO (202309);
CREATE INDEX f_producao_ambulatorial_2023_08_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2023_08 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2023_08_cid_principal_idx ON siasus.f_producao_ambulatorial_2023_08 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2023_08_cid_secundario_idx ON siasus.f_producao_ambulatorial_2023_08 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2023_08_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2023_08 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2023_08_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2023_08 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2023_08_municipio_id_idx ON siasus.f_producao_ambulatorial_2023_08 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2023_08_sexo_id_idx ON siasus.f_producao_ambulatorial_2023_08 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2023_08_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2023_08 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2023_08_uf_id_idx ON siasus.f_producao_ambulatorial_2023_08 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2023_08_uuid_idx ON siasus.f_producao_ambulatorial_2023_08 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2023__competencia_processamento_id_idx7 ON siasus.f_producao_ambulatorial_2023_08 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2023_09 definição

CREATE TABLE siasus.f_producao_ambulatorial_2023_09 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202309) TO (202310);
CREATE INDEX f_producao_ambulatorial_2023_09_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2023_09 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2023_09_cid_principal_idx ON siasus.f_producao_ambulatorial_2023_09 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2023_09_cid_secundario_idx ON siasus.f_producao_ambulatorial_2023_09 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2023_09_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2023_09 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2023_09_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2023_09 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2023_09_municipio_id_idx ON siasus.f_producao_ambulatorial_2023_09 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2023_09_sexo_id_idx ON siasus.f_producao_ambulatorial_2023_09 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2023_09_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2023_09 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2023_09_uf_id_idx ON siasus.f_producao_ambulatorial_2023_09 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2023_09_uuid_idx ON siasus.f_producao_ambulatorial_2023_09 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2023__competencia_processamento_id_idx8 ON siasus.f_producao_ambulatorial_2023_09 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2023_10 definição

CREATE TABLE siasus.f_producao_ambulatorial_2023_10 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202310) TO (202311);
CREATE INDEX f_producao_ambulatorial_2023_10_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2023_10 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2023_10_cid_principal_idx ON siasus.f_producao_ambulatorial_2023_10 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2023_10_cid_secundario_idx ON siasus.f_producao_ambulatorial_2023_10 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2023_10_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2023_10 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2023_10_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2023_10 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2023_10_municipio_id_idx ON siasus.f_producao_ambulatorial_2023_10 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2023_10_sexo_id_idx ON siasus.f_producao_ambulatorial_2023_10 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2023_10_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2023_10 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2023_10_uf_id_idx ON siasus.f_producao_ambulatorial_2023_10 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2023_10_uuid_idx ON siasus.f_producao_ambulatorial_2023_10 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2023_1_competencia_processamento_id_idx ON siasus.f_producao_ambulatorial_2023_10 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2023_11 definição

CREATE TABLE siasus.f_producao_ambulatorial_2023_11 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202311) TO (202312);
CREATE INDEX f_producao_ambulatorial_2023_11_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2023_11 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2023_11_cid_principal_idx ON siasus.f_producao_ambulatorial_2023_11 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2023_11_cid_secundario_idx ON siasus.f_producao_ambulatorial_2023_11 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2023_11_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2023_11 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2023_11_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2023_11 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2023_11_municipio_id_idx ON siasus.f_producao_ambulatorial_2023_11 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2023_11_sexo_id_idx ON siasus.f_producao_ambulatorial_2023_11 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2023_11_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2023_11 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2023_11_uf_id_idx ON siasus.f_producao_ambulatorial_2023_11 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2023_11_uuid_idx ON siasus.f_producao_ambulatorial_2023_11 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2023__competencia_processamento_id_idx9 ON siasus.f_producao_ambulatorial_2023_11 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2023_12 definição

CREATE TABLE siasus.f_producao_ambulatorial_2023_12 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202312) TO (202401);
CREATE INDEX f_producao_ambulatorial_2023_12_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2023_12 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2023_12_cid_principal_idx ON siasus.f_producao_ambulatorial_2023_12 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2023_12_cid_secundario_idx ON siasus.f_producao_ambulatorial_2023_12 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2023_12_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2023_12 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2023_12_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2023_12 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2023_12_municipio_id_idx ON siasus.f_producao_ambulatorial_2023_12 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2023_12_sexo_id_idx ON siasus.f_producao_ambulatorial_2023_12 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2023_12_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2023_12 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2023_12_uf_id_idx ON siasus.f_producao_ambulatorial_2023_12 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2023_12_uuid_idx ON siasus.f_producao_ambulatorial_2023_12 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2023_competencia_processamento_id_idx10 ON siasus.f_producao_ambulatorial_2023_12 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2024_01 definição

CREATE TABLE siasus.f_producao_ambulatorial_2024_01 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202401) TO (202402);
CREATE INDEX f_producao_ambulatorial_2024_01_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2024_01 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2024_01_cid_principal_idx ON siasus.f_producao_ambulatorial_2024_01 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2024_01_cid_secundario_idx ON siasus.f_producao_ambulatorial_2024_01 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2024_01_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2024_01 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2024_01_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2024_01 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2024_01_municipio_id_idx ON siasus.f_producao_ambulatorial_2024_01 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2024_01_sexo_id_idx ON siasus.f_producao_ambulatorial_2024_01 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2024_01_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2024_01 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2024_01_uf_id_idx ON siasus.f_producao_ambulatorial_2024_01 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2024_01_uuid_idx ON siasus.f_producao_ambulatorial_2024_01 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2024_0_competencia_processamento_id_idx ON siasus.f_producao_ambulatorial_2024_01 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2024_02 definição

CREATE TABLE siasus.f_producao_ambulatorial_2024_02 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202402) TO (202403);
CREATE INDEX f_producao_ambulatorial_2024_02_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2024_02 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2024_02_cid_principal_idx ON siasus.f_producao_ambulatorial_2024_02 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2024_02_cid_secundario_idx ON siasus.f_producao_ambulatorial_2024_02 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2024_02_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2024_02 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2024_02_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2024_02 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2024_02_municipio_id_idx ON siasus.f_producao_ambulatorial_2024_02 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2024_02_sexo_id_idx ON siasus.f_producao_ambulatorial_2024_02 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2024_02_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2024_02 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2024_02_uf_id_idx ON siasus.f_producao_ambulatorial_2024_02 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2024_02_uuid_idx ON siasus.f_producao_ambulatorial_2024_02 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2024__competencia_processamento_id_idx1 ON siasus.f_producao_ambulatorial_2024_02 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2024_03 definição

CREATE TABLE siasus.f_producao_ambulatorial_2024_03 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202403) TO (202404);
CREATE INDEX f_producao_ambulatorial_2024_03_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2024_03 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2024_03_cid_principal_idx ON siasus.f_producao_ambulatorial_2024_03 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2024_03_cid_secundario_idx ON siasus.f_producao_ambulatorial_2024_03 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2024_03_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2024_03 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2024_03_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2024_03 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2024_03_municipio_id_idx ON siasus.f_producao_ambulatorial_2024_03 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2024_03_sexo_id_idx ON siasus.f_producao_ambulatorial_2024_03 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2024_03_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2024_03 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2024_03_uf_id_idx ON siasus.f_producao_ambulatorial_2024_03 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2024_03_uuid_idx ON siasus.f_producao_ambulatorial_2024_03 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2024__competencia_processamento_id_idx2 ON siasus.f_producao_ambulatorial_2024_03 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2024_04 definição

CREATE TABLE siasus.f_producao_ambulatorial_2024_04 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202404) TO (202405);
CREATE INDEX f_producao_ambulatorial_2024_04_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2024_04 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2024_04_cid_principal_idx ON siasus.f_producao_ambulatorial_2024_04 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2024_04_cid_secundario_idx ON siasus.f_producao_ambulatorial_2024_04 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2024_04_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2024_04 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2024_04_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2024_04 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2024_04_municipio_id_idx ON siasus.f_producao_ambulatorial_2024_04 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2024_04_sexo_id_idx ON siasus.f_producao_ambulatorial_2024_04 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2024_04_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2024_04 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2024_04_uf_id_idx ON siasus.f_producao_ambulatorial_2024_04 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2024_04_uuid_idx ON siasus.f_producao_ambulatorial_2024_04 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2024__competencia_processamento_id_idx3 ON siasus.f_producao_ambulatorial_2024_04 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2024_05 definição

CREATE TABLE siasus.f_producao_ambulatorial_2024_05 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202405) TO (202406);
CREATE INDEX f_producao_ambulatorial_2024_05_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2024_05 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2024_05_cid_principal_idx ON siasus.f_producao_ambulatorial_2024_05 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2024_05_cid_secundario_idx ON siasus.f_producao_ambulatorial_2024_05 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2024_05_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2024_05 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2024_05_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2024_05 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2024_05_municipio_id_idx ON siasus.f_producao_ambulatorial_2024_05 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2024_05_sexo_id_idx ON siasus.f_producao_ambulatorial_2024_05 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2024_05_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2024_05 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2024_05_uf_id_idx ON siasus.f_producao_ambulatorial_2024_05 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2024_05_uuid_idx ON siasus.f_producao_ambulatorial_2024_05 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2024__competencia_processamento_id_idx4 ON siasus.f_producao_ambulatorial_2024_05 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2024_06 definição

CREATE TABLE siasus.f_producao_ambulatorial_2024_06 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202406) TO (202407);
CREATE INDEX f_producao_ambulatorial_2024_06_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2024_06 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2024_06_cid_principal_idx ON siasus.f_producao_ambulatorial_2024_06 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2024_06_cid_secundario_idx ON siasus.f_producao_ambulatorial_2024_06 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2024_06_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2024_06 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2024_06_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2024_06 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2024_06_municipio_id_idx ON siasus.f_producao_ambulatorial_2024_06 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2024_06_sexo_id_idx ON siasus.f_producao_ambulatorial_2024_06 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2024_06_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2024_06 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2024_06_uf_id_idx ON siasus.f_producao_ambulatorial_2024_06 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2024_06_uuid_idx ON siasus.f_producao_ambulatorial_2024_06 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2024__competencia_processamento_id_idx5 ON siasus.f_producao_ambulatorial_2024_06 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2024_07 definição

CREATE TABLE siasus.f_producao_ambulatorial_2024_07 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202407) TO (202408);
CREATE INDEX f_producao_ambulatorial_2024_07_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2024_07 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2024_07_cid_principal_idx ON siasus.f_producao_ambulatorial_2024_07 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2024_07_cid_secundario_idx ON siasus.f_producao_ambulatorial_2024_07 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2024_07_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2024_07 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2024_07_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2024_07 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2024_07_municipio_id_idx ON siasus.f_producao_ambulatorial_2024_07 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2024_07_sexo_id_idx ON siasus.f_producao_ambulatorial_2024_07 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2024_07_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2024_07 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2024_07_uf_id_idx ON siasus.f_producao_ambulatorial_2024_07 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2024_07_uuid_idx ON siasus.f_producao_ambulatorial_2024_07 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2024__competencia_processamento_id_idx6 ON siasus.f_producao_ambulatorial_2024_07 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2024_08 definição

CREATE TABLE siasus.f_producao_ambulatorial_2024_08 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202408) TO (202409);
CREATE INDEX f_producao_ambulatorial_2024_08_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2024_08 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2024_08_cid_principal_idx ON siasus.f_producao_ambulatorial_2024_08 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2024_08_cid_secundario_idx ON siasus.f_producao_ambulatorial_2024_08 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2024_08_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2024_08 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2024_08_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2024_08 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2024_08_municipio_id_idx ON siasus.f_producao_ambulatorial_2024_08 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2024_08_sexo_id_idx ON siasus.f_producao_ambulatorial_2024_08 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2024_08_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2024_08 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2024_08_uf_id_idx ON siasus.f_producao_ambulatorial_2024_08 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2024_08_uuid_idx ON siasus.f_producao_ambulatorial_2024_08 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2024__competencia_processamento_id_idx7 ON siasus.f_producao_ambulatorial_2024_08 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2024_09 definição

CREATE TABLE siasus.f_producao_ambulatorial_2024_09 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202409) TO (202410);
CREATE INDEX f_producao_ambulatorial_2024_09_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2024_09 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2024_09_cid_principal_idx ON siasus.f_producao_ambulatorial_2024_09 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2024_09_cid_secundario_idx ON siasus.f_producao_ambulatorial_2024_09 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2024_09_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2024_09 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2024_09_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2024_09 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2024_09_municipio_id_idx ON siasus.f_producao_ambulatorial_2024_09 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2024_09_sexo_id_idx ON siasus.f_producao_ambulatorial_2024_09 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2024_09_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2024_09 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2024_09_uf_id_idx ON siasus.f_producao_ambulatorial_2024_09 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2024_09_uuid_idx ON siasus.f_producao_ambulatorial_2024_09 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2024__competencia_processamento_id_idx8 ON siasus.f_producao_ambulatorial_2024_09 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2024_10 definição

CREATE TABLE siasus.f_producao_ambulatorial_2024_10 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202410) TO (202411);
CREATE INDEX f_producao_ambulatorial_2024_10_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2024_10 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2024_10_cid_principal_idx ON siasus.f_producao_ambulatorial_2024_10 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2024_10_cid_secundario_idx ON siasus.f_producao_ambulatorial_2024_10 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2024_10_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2024_10 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2024_10_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2024_10 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2024_10_municipio_id_idx ON siasus.f_producao_ambulatorial_2024_10 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2024_10_sexo_id_idx ON siasus.f_producao_ambulatorial_2024_10 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2024_10_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2024_10 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2024_10_uf_id_idx ON siasus.f_producao_ambulatorial_2024_10 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2024_10_uuid_idx ON siasus.f_producao_ambulatorial_2024_10 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2024_1_competencia_processamento_id_idx ON siasus.f_producao_ambulatorial_2024_10 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2024_11 definição

CREATE TABLE siasus.f_producao_ambulatorial_2024_11 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202411) TO (202412);
CREATE INDEX f_producao_ambulatorial_2024_11_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2024_11 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2024_11_cid_principal_idx ON siasus.f_producao_ambulatorial_2024_11 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2024_11_cid_secundario_idx ON siasus.f_producao_ambulatorial_2024_11 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2024_11_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2024_11 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2024_11_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2024_11 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2024_11_municipio_id_idx ON siasus.f_producao_ambulatorial_2024_11 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2024_11_sexo_id_idx ON siasus.f_producao_ambulatorial_2024_11 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2024_11_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2024_11 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2024_11_uf_id_idx ON siasus.f_producao_ambulatorial_2024_11 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2024_11_uuid_idx ON siasus.f_producao_ambulatorial_2024_11 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2024__competencia_processamento_id_idx9 ON siasus.f_producao_ambulatorial_2024_11 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2024_12 definição

CREATE TABLE siasus.f_producao_ambulatorial_2024_12 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202412) TO (202501);
CREATE INDEX f_producao_ambulatorial_2024_12_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2024_12 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2024_12_cid_principal_idx ON siasus.f_producao_ambulatorial_2024_12 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2024_12_cid_secundario_idx ON siasus.f_producao_ambulatorial_2024_12 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2024_12_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2024_12 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2024_12_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2024_12 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2024_12_municipio_id_idx ON siasus.f_producao_ambulatorial_2024_12 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2024_12_sexo_id_idx ON siasus.f_producao_ambulatorial_2024_12 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2024_12_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2024_12 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2024_12_uf_id_idx ON siasus.f_producao_ambulatorial_2024_12 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2024_12_uuid_idx ON siasus.f_producao_ambulatorial_2024_12 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2024_competencia_processamento_id_idx10 ON siasus.f_producao_ambulatorial_2024_12 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2025_01 definição

CREATE TABLE siasus.f_producao_ambulatorial_2025_01 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202501) TO (202502);
CREATE INDEX f_producao_ambulatorial_2025_01_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2025_01 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2025_01_cid_principal_idx ON siasus.f_producao_ambulatorial_2025_01 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2025_01_cid_secundario_idx ON siasus.f_producao_ambulatorial_2025_01 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2025_01_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2025_01 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2025_01_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2025_01 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2025_01_municipio_id_idx ON siasus.f_producao_ambulatorial_2025_01 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2025_01_sexo_id_idx ON siasus.f_producao_ambulatorial_2025_01 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2025_01_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2025_01 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2025_01_uf_id_idx ON siasus.f_producao_ambulatorial_2025_01 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2025_01_uuid_idx ON siasus.f_producao_ambulatorial_2025_01 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2025_0_competencia_processamento_id_idx ON siasus.f_producao_ambulatorial_2025_01 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2025_02 definição

CREATE TABLE siasus.f_producao_ambulatorial_2025_02 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202502) TO (202503);
CREATE INDEX f_producao_ambulatorial_2025_02_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2025_02 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2025_02_cid_principal_idx ON siasus.f_producao_ambulatorial_2025_02 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2025_02_cid_secundario_idx ON siasus.f_producao_ambulatorial_2025_02 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2025_02_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2025_02 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2025_02_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2025_02 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2025_02_municipio_id_idx ON siasus.f_producao_ambulatorial_2025_02 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2025_02_sexo_id_idx ON siasus.f_producao_ambulatorial_2025_02 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2025_02_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2025_02 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2025_02_uf_id_idx ON siasus.f_producao_ambulatorial_2025_02 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2025_02_uuid_idx ON siasus.f_producao_ambulatorial_2025_02 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2025__competencia_processamento_id_idx1 ON siasus.f_producao_ambulatorial_2025_02 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2025_03 definição

CREATE TABLE siasus.f_producao_ambulatorial_2025_03 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202503) TO (202504);
CREATE INDEX f_producao_ambulatorial_2025_03_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2025_03 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2025_03_cid_principal_idx ON siasus.f_producao_ambulatorial_2025_03 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2025_03_cid_secundario_idx ON siasus.f_producao_ambulatorial_2025_03 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2025_03_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2025_03 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2025_03_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2025_03 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2025_03_municipio_id_idx ON siasus.f_producao_ambulatorial_2025_03 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2025_03_sexo_id_idx ON siasus.f_producao_ambulatorial_2025_03 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2025_03_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2025_03 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2025_03_uf_id_idx ON siasus.f_producao_ambulatorial_2025_03 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2025_03_uuid_idx ON siasus.f_producao_ambulatorial_2025_03 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2025__competencia_processamento_id_idx2 ON siasus.f_producao_ambulatorial_2025_03 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2025_04 definição

CREATE TABLE siasus.f_producao_ambulatorial_2025_04 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202504) TO (202505);
CREATE INDEX f_producao_ambulatorial_2025_04_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2025_04 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2025_04_cid_principal_idx ON siasus.f_producao_ambulatorial_2025_04 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2025_04_cid_secundario_idx ON siasus.f_producao_ambulatorial_2025_04 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2025_04_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2025_04 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2025_04_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2025_04 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2025_04_municipio_id_idx ON siasus.f_producao_ambulatorial_2025_04 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2025_04_sexo_id_idx ON siasus.f_producao_ambulatorial_2025_04 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2025_04_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2025_04 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2025_04_uf_id_idx ON siasus.f_producao_ambulatorial_2025_04 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2025_04_uuid_idx ON siasus.f_producao_ambulatorial_2025_04 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2025__competencia_processamento_id_idx3 ON siasus.f_producao_ambulatorial_2025_04 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2025_05 definição

CREATE TABLE siasus.f_producao_ambulatorial_2025_05 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202505) TO (202506);
CREATE INDEX f_producao_ambulatorial_2025_05_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2025_05 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2025_05_cid_principal_idx ON siasus.f_producao_ambulatorial_2025_05 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2025_05_cid_secundario_idx ON siasus.f_producao_ambulatorial_2025_05 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2025_05_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2025_05 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2025_05_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2025_05 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2025_05_municipio_id_idx ON siasus.f_producao_ambulatorial_2025_05 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2025_05_sexo_id_idx ON siasus.f_producao_ambulatorial_2025_05 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2025_05_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2025_05 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2025_05_uf_id_idx ON siasus.f_producao_ambulatorial_2025_05 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2025_05_uuid_idx ON siasus.f_producao_ambulatorial_2025_05 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2025__competencia_processamento_id_idx4 ON siasus.f_producao_ambulatorial_2025_05 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2025_06 definição

CREATE TABLE siasus.f_producao_ambulatorial_2025_06 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202506) TO (202507);
CREATE INDEX f_producao_ambulatorial_2025_06_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2025_06 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2025_06_cid_principal_idx ON siasus.f_producao_ambulatorial_2025_06 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2025_06_cid_secundario_idx ON siasus.f_producao_ambulatorial_2025_06 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2025_06_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2025_06 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2025_06_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2025_06 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2025_06_municipio_id_idx ON siasus.f_producao_ambulatorial_2025_06 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2025_06_sexo_id_idx ON siasus.f_producao_ambulatorial_2025_06 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2025_06_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2025_06 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2025_06_uf_id_idx ON siasus.f_producao_ambulatorial_2025_06 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2025_06_uuid_idx ON siasus.f_producao_ambulatorial_2025_06 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2025__competencia_processamento_id_idx5 ON siasus.f_producao_ambulatorial_2025_06 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2025_07 definição

CREATE TABLE siasus.f_producao_ambulatorial_2025_07 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202507) TO (202508);
CREATE INDEX f_producao_ambulatorial_2025_07_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2025_07 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2025_07_cid_principal_idx ON siasus.f_producao_ambulatorial_2025_07 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2025_07_cid_secundario_idx ON siasus.f_producao_ambulatorial_2025_07 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2025_07_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2025_07 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2025_07_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2025_07 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2025_07_municipio_id_idx ON siasus.f_producao_ambulatorial_2025_07 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2025_07_sexo_id_idx ON siasus.f_producao_ambulatorial_2025_07 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2025_07_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2025_07 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2025_07_uf_id_idx ON siasus.f_producao_ambulatorial_2025_07 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2025_07_uuid_idx ON siasus.f_producao_ambulatorial_2025_07 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2025__competencia_processamento_id_idx6 ON siasus.f_producao_ambulatorial_2025_07 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2025_08 definição

CREATE TABLE siasus.f_producao_ambulatorial_2025_08 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202508) TO (202509);
CREATE INDEX f_producao_ambulatorial_2025_08_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2025_08 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2025_08_cid_principal_idx ON siasus.f_producao_ambulatorial_2025_08 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2025_08_cid_secundario_idx ON siasus.f_producao_ambulatorial_2025_08 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2025_08_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2025_08 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2025_08_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2025_08 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2025_08_municipio_id_idx ON siasus.f_producao_ambulatorial_2025_08 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2025_08_sexo_id_idx ON siasus.f_producao_ambulatorial_2025_08 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2025_08_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2025_08 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2025_08_uf_id_idx ON siasus.f_producao_ambulatorial_2025_08 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2025_08_uuid_idx ON siasus.f_producao_ambulatorial_2025_08 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2025__competencia_processamento_id_idx7 ON siasus.f_producao_ambulatorial_2025_08 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2025_09 definição

CREATE TABLE siasus.f_producao_ambulatorial_2025_09 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202509) TO (202510);
CREATE INDEX f_producao_ambulatorial_2025_09_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2025_09 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2025_09_cid_principal_idx ON siasus.f_producao_ambulatorial_2025_09 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2025_09_cid_secundario_idx ON siasus.f_producao_ambulatorial_2025_09 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2025_09_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2025_09 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2025_09_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2025_09 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2025_09_municipio_id_idx ON siasus.f_producao_ambulatorial_2025_09 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2025_09_sexo_id_idx ON siasus.f_producao_ambulatorial_2025_09 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2025_09_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2025_09 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2025_09_uf_id_idx ON siasus.f_producao_ambulatorial_2025_09 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2025_09_uuid_idx ON siasus.f_producao_ambulatorial_2025_09 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2025__competencia_processamento_id_idx8 ON siasus.f_producao_ambulatorial_2025_09 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2025_10 definição

CREATE TABLE siasus.f_producao_ambulatorial_2025_10 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202510) TO (202511);
CREATE INDEX f_producao_ambulatorial_2025_10_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2025_10 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2025_10_cid_principal_idx ON siasus.f_producao_ambulatorial_2025_10 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2025_10_cid_secundario_idx ON siasus.f_producao_ambulatorial_2025_10 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2025_10_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2025_10 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2025_10_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2025_10 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2025_10_municipio_id_idx ON siasus.f_producao_ambulatorial_2025_10 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2025_10_sexo_id_idx ON siasus.f_producao_ambulatorial_2025_10 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2025_10_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2025_10 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2025_10_uf_id_idx ON siasus.f_producao_ambulatorial_2025_10 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2025_10_uuid_idx ON siasus.f_producao_ambulatorial_2025_10 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2025_1_competencia_processamento_id_idx ON siasus.f_producao_ambulatorial_2025_10 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2025_11 definição

CREATE TABLE siasus.f_producao_ambulatorial_2025_11 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202511) TO (202512);
CREATE INDEX f_producao_ambulatorial_2025_11_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2025_11 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2025_11_cid_principal_idx ON siasus.f_producao_ambulatorial_2025_11 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2025_11_cid_secundario_idx ON siasus.f_producao_ambulatorial_2025_11 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2025_11_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2025_11 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2025_11_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2025_11 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2025_11_municipio_id_idx ON siasus.f_producao_ambulatorial_2025_11 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2025_11_sexo_id_idx ON siasus.f_producao_ambulatorial_2025_11 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2025_11_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2025_11 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2025_11_uf_id_idx ON siasus.f_producao_ambulatorial_2025_11 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2025_11_uuid_idx ON siasus.f_producao_ambulatorial_2025_11 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2025__competencia_processamento_id_idx9 ON siasus.f_producao_ambulatorial_2025_11 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2025_12 definição

CREATE TABLE siasus.f_producao_ambulatorial_2025_12 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202512) TO (202601);
CREATE INDEX f_producao_ambulatorial_2025_12_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2025_12 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2025_12_cid_principal_idx ON siasus.f_producao_ambulatorial_2025_12 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2025_12_cid_secundario_idx ON siasus.f_producao_ambulatorial_2025_12 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2025_12_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2025_12 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2025_12_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2025_12 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2025_12_municipio_id_idx ON siasus.f_producao_ambulatorial_2025_12 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2025_12_sexo_id_idx ON siasus.f_producao_ambulatorial_2025_12 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2025_12_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2025_12 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2025_12_uf_id_idx ON siasus.f_producao_ambulatorial_2025_12 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2025_12_uuid_idx ON siasus.f_producao_ambulatorial_2025_12 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2025_competencia_processamento_id_idx10 ON siasus.f_producao_ambulatorial_2025_12 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2026_01 definição

CREATE TABLE siasus.f_producao_ambulatorial_2026_01 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202601) TO (202602);
CREATE INDEX f_producao_ambulatorial_2026_01_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2026_01 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2026_01_cid_principal_idx ON siasus.f_producao_ambulatorial_2026_01 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2026_01_cid_secundario_idx ON siasus.f_producao_ambulatorial_2026_01 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2026_01_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2026_01 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2026_01_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2026_01 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2026_01_municipio_id_idx ON siasus.f_producao_ambulatorial_2026_01 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2026_01_sexo_id_idx ON siasus.f_producao_ambulatorial_2026_01 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2026_01_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2026_01 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2026_01_uf_id_idx ON siasus.f_producao_ambulatorial_2026_01 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2026_01_uuid_idx ON siasus.f_producao_ambulatorial_2026_01 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2026_0_competencia_processamento_id_idx ON siasus.f_producao_ambulatorial_2026_01 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2026_02 definição

CREATE TABLE siasus.f_producao_ambulatorial_2026_02 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202602) TO (202603);
CREATE INDEX f_producao_ambulatorial_2026_02_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2026_02 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2026_02_cid_principal_idx ON siasus.f_producao_ambulatorial_2026_02 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2026_02_cid_secundario_idx ON siasus.f_producao_ambulatorial_2026_02 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2026_02_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2026_02 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2026_02_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2026_02 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2026_02_municipio_id_idx ON siasus.f_producao_ambulatorial_2026_02 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2026_02_sexo_id_idx ON siasus.f_producao_ambulatorial_2026_02 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2026_02_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2026_02 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2026_02_uf_id_idx ON siasus.f_producao_ambulatorial_2026_02 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2026_02_uuid_idx ON siasus.f_producao_ambulatorial_2026_02 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2026__competencia_processamento_id_idx1 ON siasus.f_producao_ambulatorial_2026_02 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2026_03 definição

CREATE TABLE siasus.f_producao_ambulatorial_2026_03 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202603) TO (202604);
CREATE INDEX f_producao_ambulatorial_2026_03_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2026_03 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2026_03_cid_principal_idx ON siasus.f_producao_ambulatorial_2026_03 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2026_03_cid_secundario_idx ON siasus.f_producao_ambulatorial_2026_03 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2026_03_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2026_03 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2026_03_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2026_03 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2026_03_municipio_id_idx ON siasus.f_producao_ambulatorial_2026_03 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2026_03_sexo_id_idx ON siasus.f_producao_ambulatorial_2026_03 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2026_03_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2026_03 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2026_03_uf_id_idx ON siasus.f_producao_ambulatorial_2026_03 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2026_03_uuid_idx ON siasus.f_producao_ambulatorial_2026_03 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2026__competencia_processamento_id_idx2 ON siasus.f_producao_ambulatorial_2026_03 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2026_04 definição

CREATE TABLE siasus.f_producao_ambulatorial_2026_04 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202604) TO (202605);
CREATE INDEX f_producao_ambulatorial_2026_04_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2026_04 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2026_04_cid_principal_idx ON siasus.f_producao_ambulatorial_2026_04 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2026_04_cid_secundario_idx ON siasus.f_producao_ambulatorial_2026_04 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2026_04_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2026_04 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2026_04_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2026_04 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2026_04_municipio_id_idx ON siasus.f_producao_ambulatorial_2026_04 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2026_04_sexo_id_idx ON siasus.f_producao_ambulatorial_2026_04 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2026_04_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2026_04 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2026_04_uf_id_idx ON siasus.f_producao_ambulatorial_2026_04 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2026_04_uuid_idx ON siasus.f_producao_ambulatorial_2026_04 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2026__competencia_processamento_id_idx3 ON siasus.f_producao_ambulatorial_2026_04 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2026_05 definição

CREATE TABLE siasus.f_producao_ambulatorial_2026_05 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202605) TO (202606);
CREATE INDEX f_producao_ambulatorial_2026_05_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2026_05 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2026_05_cid_principal_idx ON siasus.f_producao_ambulatorial_2026_05 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2026_05_cid_secundario_idx ON siasus.f_producao_ambulatorial_2026_05 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2026_05_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2026_05 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2026_05_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2026_05 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2026_05_municipio_id_idx ON siasus.f_producao_ambulatorial_2026_05 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2026_05_sexo_id_idx ON siasus.f_producao_ambulatorial_2026_05 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2026_05_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2026_05 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2026_05_uf_id_idx ON siasus.f_producao_ambulatorial_2026_05 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2026_05_uuid_idx ON siasus.f_producao_ambulatorial_2026_05 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2026__competencia_processamento_id_idx4 ON siasus.f_producao_ambulatorial_2026_05 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2026_06 definição

CREATE TABLE siasus.f_producao_ambulatorial_2026_06 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202606) TO (202607);
CREATE INDEX f_producao_ambulatorial_2026_06_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2026_06 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2026_06_cid_principal_idx ON siasus.f_producao_ambulatorial_2026_06 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2026_06_cid_secundario_idx ON siasus.f_producao_ambulatorial_2026_06 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2026_06_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2026_06 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2026_06_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2026_06 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2026_06_municipio_id_idx ON siasus.f_producao_ambulatorial_2026_06 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2026_06_sexo_id_idx ON siasus.f_producao_ambulatorial_2026_06 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2026_06_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2026_06 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2026_06_uf_id_idx ON siasus.f_producao_ambulatorial_2026_06 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2026_06_uuid_idx ON siasus.f_producao_ambulatorial_2026_06 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2026__competencia_processamento_id_idx5 ON siasus.f_producao_ambulatorial_2026_06 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2026_07 definição

CREATE TABLE siasus.f_producao_ambulatorial_2026_07 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202607) TO (202608);
CREATE INDEX f_producao_ambulatorial_2026_07_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2026_07 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2026_07_cid_principal_idx ON siasus.f_producao_ambulatorial_2026_07 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2026_07_cid_secundario_idx ON siasus.f_producao_ambulatorial_2026_07 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2026_07_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2026_07 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2026_07_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2026_07 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2026_07_municipio_id_idx ON siasus.f_producao_ambulatorial_2026_07 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2026_07_sexo_id_idx ON siasus.f_producao_ambulatorial_2026_07 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2026_07_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2026_07 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2026_07_uf_id_idx ON siasus.f_producao_ambulatorial_2026_07 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2026_07_uuid_idx ON siasus.f_producao_ambulatorial_2026_07 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2026__competencia_processamento_id_idx6 ON siasus.f_producao_ambulatorial_2026_07 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2026_08 definição

CREATE TABLE siasus.f_producao_ambulatorial_2026_08 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202608) TO (202609);
CREATE INDEX f_producao_ambulatorial_2026_08_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2026_08 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2026_08_cid_principal_idx ON siasus.f_producao_ambulatorial_2026_08 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2026_08_cid_secundario_idx ON siasus.f_producao_ambulatorial_2026_08 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2026_08_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2026_08 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2026_08_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2026_08 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2026_08_municipio_id_idx ON siasus.f_producao_ambulatorial_2026_08 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2026_08_sexo_id_idx ON siasus.f_producao_ambulatorial_2026_08 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2026_08_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2026_08 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2026_08_uf_id_idx ON siasus.f_producao_ambulatorial_2026_08 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2026_08_uuid_idx ON siasus.f_producao_ambulatorial_2026_08 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2026__competencia_processamento_id_idx7 ON siasus.f_producao_ambulatorial_2026_08 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2026_09 definição

CREATE TABLE siasus.f_producao_ambulatorial_2026_09 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202609) TO (202610);
CREATE INDEX f_producao_ambulatorial_2026_09_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2026_09 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2026_09_cid_principal_idx ON siasus.f_producao_ambulatorial_2026_09 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2026_09_cid_secundario_idx ON siasus.f_producao_ambulatorial_2026_09 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2026_09_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2026_09 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2026_09_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2026_09 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2026_09_municipio_id_idx ON siasus.f_producao_ambulatorial_2026_09 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2026_09_sexo_id_idx ON siasus.f_producao_ambulatorial_2026_09 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2026_09_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2026_09 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2026_09_uf_id_idx ON siasus.f_producao_ambulatorial_2026_09 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2026_09_uuid_idx ON siasus.f_producao_ambulatorial_2026_09 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2026__competencia_processamento_id_idx8 ON siasus.f_producao_ambulatorial_2026_09 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2026_10 definição

CREATE TABLE siasus.f_producao_ambulatorial_2026_10 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202610) TO (202611);
CREATE INDEX f_producao_ambulatorial_2026_10_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2026_10 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2026_10_cid_principal_idx ON siasus.f_producao_ambulatorial_2026_10 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2026_10_cid_secundario_idx ON siasus.f_producao_ambulatorial_2026_10 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2026_10_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2026_10 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2026_10_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2026_10 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2026_10_municipio_id_idx ON siasus.f_producao_ambulatorial_2026_10 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2026_10_sexo_id_idx ON siasus.f_producao_ambulatorial_2026_10 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2026_10_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2026_10 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2026_10_uf_id_idx ON siasus.f_producao_ambulatorial_2026_10 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2026_10_uuid_idx ON siasus.f_producao_ambulatorial_2026_10 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2026_1_competencia_processamento_id_idx ON siasus.f_producao_ambulatorial_2026_10 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2026_11 definição

CREATE TABLE siasus.f_producao_ambulatorial_2026_11 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202611) TO (202612);
CREATE INDEX f_producao_ambulatorial_2026_11_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2026_11 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2026_11_cid_principal_idx ON siasus.f_producao_ambulatorial_2026_11 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2026_11_cid_secundario_idx ON siasus.f_producao_ambulatorial_2026_11 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2026_11_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2026_11 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2026_11_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2026_11 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2026_11_municipio_id_idx ON siasus.f_producao_ambulatorial_2026_11 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2026_11_sexo_id_idx ON siasus.f_producao_ambulatorial_2026_11 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2026_11_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2026_11 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2026_11_uf_id_idx ON siasus.f_producao_ambulatorial_2026_11 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2026_11_uuid_idx ON siasus.f_producao_ambulatorial_2026_11 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2026__competencia_processamento_id_idx9 ON siasus.f_producao_ambulatorial_2026_11 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2026_12 definição

CREATE TABLE siasus.f_producao_ambulatorial_2026_12 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202612) TO (202701);
CREATE INDEX f_producao_ambulatorial_2026_12_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2026_12 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2026_12_cid_principal_idx ON siasus.f_producao_ambulatorial_2026_12 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2026_12_cid_secundario_idx ON siasus.f_producao_ambulatorial_2026_12 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2026_12_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2026_12 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2026_12_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2026_12 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2026_12_municipio_id_idx ON siasus.f_producao_ambulatorial_2026_12 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2026_12_sexo_id_idx ON siasus.f_producao_ambulatorial_2026_12 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2026_12_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2026_12 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2026_12_uf_id_idx ON siasus.f_producao_ambulatorial_2026_12 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2026_12_uuid_idx ON siasus.f_producao_ambulatorial_2026_12 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2026_competencia_processamento_id_idx10 ON siasus.f_producao_ambulatorial_2026_12 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2027_01 definição

CREATE TABLE siasus.f_producao_ambulatorial_2027_01 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202701) TO (202702);
CREATE INDEX f_producao_ambulatorial_2027_01_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2027_01 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2027_01_cid_principal_idx ON siasus.f_producao_ambulatorial_2027_01 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2027_01_cid_secundario_idx ON siasus.f_producao_ambulatorial_2027_01 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2027_01_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2027_01 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2027_01_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2027_01 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2027_01_municipio_id_idx ON siasus.f_producao_ambulatorial_2027_01 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2027_01_sexo_id_idx ON siasus.f_producao_ambulatorial_2027_01 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2027_01_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2027_01 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2027_01_uf_id_idx ON siasus.f_producao_ambulatorial_2027_01 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2027_01_uuid_idx ON siasus.f_producao_ambulatorial_2027_01 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2027_0_competencia_processamento_id_idx ON siasus.f_producao_ambulatorial_2027_01 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2027_02 definição

CREATE TABLE siasus.f_producao_ambulatorial_2027_02 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202702) TO (202703);
CREATE INDEX f_producao_ambulatorial_2027_02_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2027_02 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2027_02_cid_principal_idx ON siasus.f_producao_ambulatorial_2027_02 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2027_02_cid_secundario_idx ON siasus.f_producao_ambulatorial_2027_02 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2027_02_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2027_02 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2027_02_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2027_02 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2027_02_municipio_id_idx ON siasus.f_producao_ambulatorial_2027_02 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2027_02_sexo_id_idx ON siasus.f_producao_ambulatorial_2027_02 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2027_02_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2027_02 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2027_02_uf_id_idx ON siasus.f_producao_ambulatorial_2027_02 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2027_02_uuid_idx ON siasus.f_producao_ambulatorial_2027_02 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2027__competencia_processamento_id_idx1 ON siasus.f_producao_ambulatorial_2027_02 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2027_03 definição

CREATE TABLE siasus.f_producao_ambulatorial_2027_03 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202703) TO (202704);
CREATE INDEX f_producao_ambulatorial_2027_03_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2027_03 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2027_03_cid_principal_idx ON siasus.f_producao_ambulatorial_2027_03 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2027_03_cid_secundario_idx ON siasus.f_producao_ambulatorial_2027_03 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2027_03_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2027_03 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2027_03_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2027_03 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2027_03_municipio_id_idx ON siasus.f_producao_ambulatorial_2027_03 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2027_03_sexo_id_idx ON siasus.f_producao_ambulatorial_2027_03 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2027_03_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2027_03 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2027_03_uf_id_idx ON siasus.f_producao_ambulatorial_2027_03 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2027_03_uuid_idx ON siasus.f_producao_ambulatorial_2027_03 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2027__competencia_processamento_id_idx2 ON siasus.f_producao_ambulatorial_2027_03 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2027_04 definição

CREATE TABLE siasus.f_producao_ambulatorial_2027_04 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202704) TO (202705);
CREATE INDEX f_producao_ambulatorial_2027_04_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2027_04 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2027_04_cid_principal_idx ON siasus.f_producao_ambulatorial_2027_04 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2027_04_cid_secundario_idx ON siasus.f_producao_ambulatorial_2027_04 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2027_04_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2027_04 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2027_04_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2027_04 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2027_04_municipio_id_idx ON siasus.f_producao_ambulatorial_2027_04 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2027_04_sexo_id_idx ON siasus.f_producao_ambulatorial_2027_04 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2027_04_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2027_04 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2027_04_uf_id_idx ON siasus.f_producao_ambulatorial_2027_04 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2027_04_uuid_idx ON siasus.f_producao_ambulatorial_2027_04 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2027__competencia_processamento_id_idx3 ON siasus.f_producao_ambulatorial_2027_04 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2027_05 definição

CREATE TABLE siasus.f_producao_ambulatorial_2027_05 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202705) TO (202706);
CREATE INDEX f_producao_ambulatorial_2027_05_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2027_05 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2027_05_cid_principal_idx ON siasus.f_producao_ambulatorial_2027_05 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2027_05_cid_secundario_idx ON siasus.f_producao_ambulatorial_2027_05 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2027_05_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2027_05 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2027_05_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2027_05 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2027_05_municipio_id_idx ON siasus.f_producao_ambulatorial_2027_05 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2027_05_sexo_id_idx ON siasus.f_producao_ambulatorial_2027_05 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2027_05_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2027_05 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2027_05_uf_id_idx ON siasus.f_producao_ambulatorial_2027_05 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2027_05_uuid_idx ON siasus.f_producao_ambulatorial_2027_05 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2027__competencia_processamento_id_idx4 ON siasus.f_producao_ambulatorial_2027_05 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2027_06 definição

CREATE TABLE siasus.f_producao_ambulatorial_2027_06 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202706) TO (202707);
CREATE INDEX f_producao_ambulatorial_2027_06_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2027_06 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2027_06_cid_principal_idx ON siasus.f_producao_ambulatorial_2027_06 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2027_06_cid_secundario_idx ON siasus.f_producao_ambulatorial_2027_06 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2027_06_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2027_06 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2027_06_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2027_06 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2027_06_municipio_id_idx ON siasus.f_producao_ambulatorial_2027_06 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2027_06_sexo_id_idx ON siasus.f_producao_ambulatorial_2027_06 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2027_06_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2027_06 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2027_06_uf_id_idx ON siasus.f_producao_ambulatorial_2027_06 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2027_06_uuid_idx ON siasus.f_producao_ambulatorial_2027_06 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2027__competencia_processamento_id_idx5 ON siasus.f_producao_ambulatorial_2027_06 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2027_07 definição

CREATE TABLE siasus.f_producao_ambulatorial_2027_07 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202707) TO (202708);
CREATE INDEX f_producao_ambulatorial_2027_07_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2027_07 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2027_07_cid_principal_idx ON siasus.f_producao_ambulatorial_2027_07 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2027_07_cid_secundario_idx ON siasus.f_producao_ambulatorial_2027_07 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2027_07_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2027_07 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2027_07_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2027_07 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2027_07_municipio_id_idx ON siasus.f_producao_ambulatorial_2027_07 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2027_07_sexo_id_idx ON siasus.f_producao_ambulatorial_2027_07 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2027_07_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2027_07 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2027_07_uf_id_idx ON siasus.f_producao_ambulatorial_2027_07 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2027_07_uuid_idx ON siasus.f_producao_ambulatorial_2027_07 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2027__competencia_processamento_id_idx6 ON siasus.f_producao_ambulatorial_2027_07 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2027_08 definição

CREATE TABLE siasus.f_producao_ambulatorial_2027_08 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202708) TO (202709);
CREATE INDEX f_producao_ambulatorial_2027_08_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2027_08 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2027_08_cid_principal_idx ON siasus.f_producao_ambulatorial_2027_08 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2027_08_cid_secundario_idx ON siasus.f_producao_ambulatorial_2027_08 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2027_08_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2027_08 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2027_08_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2027_08 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2027_08_municipio_id_idx ON siasus.f_producao_ambulatorial_2027_08 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2027_08_sexo_id_idx ON siasus.f_producao_ambulatorial_2027_08 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2027_08_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2027_08 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2027_08_uf_id_idx ON siasus.f_producao_ambulatorial_2027_08 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2027_08_uuid_idx ON siasus.f_producao_ambulatorial_2027_08 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2027__competencia_processamento_id_idx7 ON siasus.f_producao_ambulatorial_2027_08 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2027_09 definição

CREATE TABLE siasus.f_producao_ambulatorial_2027_09 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202709) TO (202710);
CREATE INDEX f_producao_ambulatorial_2027_09_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2027_09 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2027_09_cid_principal_idx ON siasus.f_producao_ambulatorial_2027_09 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2027_09_cid_secundario_idx ON siasus.f_producao_ambulatorial_2027_09 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2027_09_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2027_09 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2027_09_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2027_09 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2027_09_municipio_id_idx ON siasus.f_producao_ambulatorial_2027_09 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2027_09_sexo_id_idx ON siasus.f_producao_ambulatorial_2027_09 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2027_09_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2027_09 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2027_09_uf_id_idx ON siasus.f_producao_ambulatorial_2027_09 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2027_09_uuid_idx ON siasus.f_producao_ambulatorial_2027_09 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2027__competencia_processamento_id_idx8 ON siasus.f_producao_ambulatorial_2027_09 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2027_10 definição

CREATE TABLE siasus.f_producao_ambulatorial_2027_10 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202710) TO (202711);
CREATE INDEX f_producao_ambulatorial_2027_10_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2027_10 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2027_10_cid_principal_idx ON siasus.f_producao_ambulatorial_2027_10 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2027_10_cid_secundario_idx ON siasus.f_producao_ambulatorial_2027_10 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2027_10_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2027_10 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2027_10_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2027_10 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2027_10_municipio_id_idx ON siasus.f_producao_ambulatorial_2027_10 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2027_10_sexo_id_idx ON siasus.f_producao_ambulatorial_2027_10 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2027_10_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2027_10 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2027_10_uf_id_idx ON siasus.f_producao_ambulatorial_2027_10 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2027_10_uuid_idx ON siasus.f_producao_ambulatorial_2027_10 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2027_1_competencia_processamento_id_idx ON siasus.f_producao_ambulatorial_2027_10 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2027_11 definição

CREATE TABLE siasus.f_producao_ambulatorial_2027_11 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202711) TO (202712);
CREATE INDEX f_producao_ambulatorial_2027_11_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2027_11 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2027_11_cid_principal_idx ON siasus.f_producao_ambulatorial_2027_11 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2027_11_cid_secundario_idx ON siasus.f_producao_ambulatorial_2027_11 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2027_11_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2027_11 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2027_11_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2027_11 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2027_11_municipio_id_idx ON siasus.f_producao_ambulatorial_2027_11 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2027_11_sexo_id_idx ON siasus.f_producao_ambulatorial_2027_11 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2027_11_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2027_11 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2027_11_uf_id_idx ON siasus.f_producao_ambulatorial_2027_11 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2027_11_uuid_idx ON siasus.f_producao_ambulatorial_2027_11 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2027__competencia_processamento_id_idx9 ON siasus.f_producao_ambulatorial_2027_11 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2027_12 definição

CREATE TABLE siasus.f_producao_ambulatorial_2027_12 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202712) TO (202801);
CREATE INDEX f_producao_ambulatorial_2027_12_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2027_12 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2027_12_cid_principal_idx ON siasus.f_producao_ambulatorial_2027_12 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2027_12_cid_secundario_idx ON siasus.f_producao_ambulatorial_2027_12 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2027_12_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2027_12 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2027_12_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2027_12 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2027_12_municipio_id_idx ON siasus.f_producao_ambulatorial_2027_12 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2027_12_sexo_id_idx ON siasus.f_producao_ambulatorial_2027_12 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2027_12_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2027_12 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2027_12_uf_id_idx ON siasus.f_producao_ambulatorial_2027_12 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2027_12_uuid_idx ON siasus.f_producao_ambulatorial_2027_12 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2027_competencia_processamento_id_idx10 ON siasus.f_producao_ambulatorial_2027_12 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2028_01 definição

CREATE TABLE siasus.f_producao_ambulatorial_2028_01 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202801) TO (202802);
CREATE INDEX f_producao_ambulatorial_2028_01_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2028_01 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2028_01_cid_principal_idx ON siasus.f_producao_ambulatorial_2028_01 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2028_01_cid_secundario_idx ON siasus.f_producao_ambulatorial_2028_01 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2028_01_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2028_01 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2028_01_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2028_01 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2028_01_municipio_id_idx ON siasus.f_producao_ambulatorial_2028_01 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2028_01_sexo_id_idx ON siasus.f_producao_ambulatorial_2028_01 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2028_01_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2028_01 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2028_01_uf_id_idx ON siasus.f_producao_ambulatorial_2028_01 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2028_01_uuid_idx ON siasus.f_producao_ambulatorial_2028_01 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2028_0_competencia_processamento_id_idx ON siasus.f_producao_ambulatorial_2028_01 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2028_02 definição

CREATE TABLE siasus.f_producao_ambulatorial_2028_02 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202802) TO (202803);
CREATE INDEX f_producao_ambulatorial_2028_02_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2028_02 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2028_02_cid_principal_idx ON siasus.f_producao_ambulatorial_2028_02 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2028_02_cid_secundario_idx ON siasus.f_producao_ambulatorial_2028_02 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2028_02_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2028_02 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2028_02_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2028_02 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2028_02_municipio_id_idx ON siasus.f_producao_ambulatorial_2028_02 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2028_02_sexo_id_idx ON siasus.f_producao_ambulatorial_2028_02 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2028_02_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2028_02 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2028_02_uf_id_idx ON siasus.f_producao_ambulatorial_2028_02 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2028_02_uuid_idx ON siasus.f_producao_ambulatorial_2028_02 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2028__competencia_processamento_id_idx1 ON siasus.f_producao_ambulatorial_2028_02 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2028_03 definição

CREATE TABLE siasus.f_producao_ambulatorial_2028_03 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202803) TO (202804);
CREATE INDEX f_producao_ambulatorial_2028_03_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2028_03 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2028_03_cid_principal_idx ON siasus.f_producao_ambulatorial_2028_03 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2028_03_cid_secundario_idx ON siasus.f_producao_ambulatorial_2028_03 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2028_03_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2028_03 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2028_03_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2028_03 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2028_03_municipio_id_idx ON siasus.f_producao_ambulatorial_2028_03 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2028_03_sexo_id_idx ON siasus.f_producao_ambulatorial_2028_03 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2028_03_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2028_03 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2028_03_uf_id_idx ON siasus.f_producao_ambulatorial_2028_03 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2028_03_uuid_idx ON siasus.f_producao_ambulatorial_2028_03 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2028__competencia_processamento_id_idx2 ON siasus.f_producao_ambulatorial_2028_03 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2028_04 definição

CREATE TABLE siasus.f_producao_ambulatorial_2028_04 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202804) TO (202805);
CREATE INDEX f_producao_ambulatorial_2028_04_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2028_04 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2028_04_cid_principal_idx ON siasus.f_producao_ambulatorial_2028_04 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2028_04_cid_secundario_idx ON siasus.f_producao_ambulatorial_2028_04 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2028_04_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2028_04 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2028_04_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2028_04 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2028_04_municipio_id_idx ON siasus.f_producao_ambulatorial_2028_04 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2028_04_sexo_id_idx ON siasus.f_producao_ambulatorial_2028_04 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2028_04_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2028_04 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2028_04_uf_id_idx ON siasus.f_producao_ambulatorial_2028_04 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2028_04_uuid_idx ON siasus.f_producao_ambulatorial_2028_04 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2028__competencia_processamento_id_idx3 ON siasus.f_producao_ambulatorial_2028_04 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2028_05 definição

CREATE TABLE siasus.f_producao_ambulatorial_2028_05 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202805) TO (202806);
CREATE INDEX f_producao_ambulatorial_2028_05_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2028_05 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2028_05_cid_principal_idx ON siasus.f_producao_ambulatorial_2028_05 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2028_05_cid_secundario_idx ON siasus.f_producao_ambulatorial_2028_05 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2028_05_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2028_05 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2028_05_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2028_05 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2028_05_municipio_id_idx ON siasus.f_producao_ambulatorial_2028_05 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2028_05_sexo_id_idx ON siasus.f_producao_ambulatorial_2028_05 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2028_05_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2028_05 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2028_05_uf_id_idx ON siasus.f_producao_ambulatorial_2028_05 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2028_05_uuid_idx ON siasus.f_producao_ambulatorial_2028_05 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2028__competencia_processamento_id_idx4 ON siasus.f_producao_ambulatorial_2028_05 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2028_06 definição

CREATE TABLE siasus.f_producao_ambulatorial_2028_06 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202806) TO (202807);
CREATE INDEX f_producao_ambulatorial_2028_06_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2028_06 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2028_06_cid_principal_idx ON siasus.f_producao_ambulatorial_2028_06 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2028_06_cid_secundario_idx ON siasus.f_producao_ambulatorial_2028_06 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2028_06_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2028_06 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2028_06_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2028_06 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2028_06_municipio_id_idx ON siasus.f_producao_ambulatorial_2028_06 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2028_06_sexo_id_idx ON siasus.f_producao_ambulatorial_2028_06 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2028_06_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2028_06 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2028_06_uf_id_idx ON siasus.f_producao_ambulatorial_2028_06 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2028_06_uuid_idx ON siasus.f_producao_ambulatorial_2028_06 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2028__competencia_processamento_id_idx5 ON siasus.f_producao_ambulatorial_2028_06 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2028_07 definição

CREATE TABLE siasus.f_producao_ambulatorial_2028_07 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202807) TO (202808);
CREATE INDEX f_producao_ambulatorial_2028_07_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2028_07 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2028_07_cid_principal_idx ON siasus.f_producao_ambulatorial_2028_07 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2028_07_cid_secundario_idx ON siasus.f_producao_ambulatorial_2028_07 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2028_07_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2028_07 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2028_07_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2028_07 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2028_07_municipio_id_idx ON siasus.f_producao_ambulatorial_2028_07 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2028_07_sexo_id_idx ON siasus.f_producao_ambulatorial_2028_07 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2028_07_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2028_07 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2028_07_uf_id_idx ON siasus.f_producao_ambulatorial_2028_07 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2028_07_uuid_idx ON siasus.f_producao_ambulatorial_2028_07 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2028__competencia_processamento_id_idx6 ON siasus.f_producao_ambulatorial_2028_07 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2028_08 definição

CREATE TABLE siasus.f_producao_ambulatorial_2028_08 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202808) TO (202809);
CREATE INDEX f_producao_ambulatorial_2028_08_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2028_08 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2028_08_cid_principal_idx ON siasus.f_producao_ambulatorial_2028_08 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2028_08_cid_secundario_idx ON siasus.f_producao_ambulatorial_2028_08 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2028_08_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2028_08 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2028_08_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2028_08 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2028_08_municipio_id_idx ON siasus.f_producao_ambulatorial_2028_08 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2028_08_sexo_id_idx ON siasus.f_producao_ambulatorial_2028_08 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2028_08_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2028_08 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2028_08_uf_id_idx ON siasus.f_producao_ambulatorial_2028_08 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2028_08_uuid_idx ON siasus.f_producao_ambulatorial_2028_08 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2028__competencia_processamento_id_idx7 ON siasus.f_producao_ambulatorial_2028_08 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2028_09 definição

CREATE TABLE siasus.f_producao_ambulatorial_2028_09 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202809) TO (202810);
CREATE INDEX f_producao_ambulatorial_2028_09_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2028_09 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2028_09_cid_principal_idx ON siasus.f_producao_ambulatorial_2028_09 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2028_09_cid_secundario_idx ON siasus.f_producao_ambulatorial_2028_09 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2028_09_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2028_09 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2028_09_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2028_09 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2028_09_municipio_id_idx ON siasus.f_producao_ambulatorial_2028_09 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2028_09_sexo_id_idx ON siasus.f_producao_ambulatorial_2028_09 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2028_09_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2028_09 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2028_09_uf_id_idx ON siasus.f_producao_ambulatorial_2028_09 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2028_09_uuid_idx ON siasus.f_producao_ambulatorial_2028_09 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2028__competencia_processamento_id_idx8 ON siasus.f_producao_ambulatorial_2028_09 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2028_10 definição

CREATE TABLE siasus.f_producao_ambulatorial_2028_10 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202810) TO (202811);
CREATE INDEX f_producao_ambulatorial_2028_10_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2028_10 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2028_10_cid_principal_idx ON siasus.f_producao_ambulatorial_2028_10 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2028_10_cid_secundario_idx ON siasus.f_producao_ambulatorial_2028_10 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2028_10_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2028_10 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2028_10_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2028_10 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2028_10_municipio_id_idx ON siasus.f_producao_ambulatorial_2028_10 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2028_10_sexo_id_idx ON siasus.f_producao_ambulatorial_2028_10 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2028_10_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2028_10 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2028_10_uf_id_idx ON siasus.f_producao_ambulatorial_2028_10 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2028_10_uuid_idx ON siasus.f_producao_ambulatorial_2028_10 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2028_1_competencia_processamento_id_idx ON siasus.f_producao_ambulatorial_2028_10 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2028_11 definição

CREATE TABLE siasus.f_producao_ambulatorial_2028_11 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202811) TO (202812);
CREATE INDEX f_producao_ambulatorial_2028_11_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2028_11 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2028_11_cid_principal_idx ON siasus.f_producao_ambulatorial_2028_11 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2028_11_cid_secundario_idx ON siasus.f_producao_ambulatorial_2028_11 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2028_11_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2028_11 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2028_11_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2028_11 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2028_11_municipio_id_idx ON siasus.f_producao_ambulatorial_2028_11 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2028_11_sexo_id_idx ON siasus.f_producao_ambulatorial_2028_11 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2028_11_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2028_11 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2028_11_uf_id_idx ON siasus.f_producao_ambulatorial_2028_11 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2028_11_uuid_idx ON siasus.f_producao_ambulatorial_2028_11 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2028__competencia_processamento_id_idx9 ON siasus.f_producao_ambulatorial_2028_11 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2028_12 definição

CREATE TABLE siasus.f_producao_ambulatorial_2028_12 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202812) TO (202901);
CREATE INDEX f_producao_ambulatorial_2028_12_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2028_12 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2028_12_cid_principal_idx ON siasus.f_producao_ambulatorial_2028_12 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2028_12_cid_secundario_idx ON siasus.f_producao_ambulatorial_2028_12 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2028_12_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2028_12 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2028_12_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2028_12 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2028_12_municipio_id_idx ON siasus.f_producao_ambulatorial_2028_12 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2028_12_sexo_id_idx ON siasus.f_producao_ambulatorial_2028_12 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2028_12_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2028_12 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2028_12_uf_id_idx ON siasus.f_producao_ambulatorial_2028_12 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2028_12_uuid_idx ON siasus.f_producao_ambulatorial_2028_12 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2028_competencia_processamento_id_idx10 ON siasus.f_producao_ambulatorial_2028_12 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2029_01 definição

CREATE TABLE siasus.f_producao_ambulatorial_2029_01 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202901) TO (202902);
CREATE INDEX f_producao_ambulatorial_2029_01_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2029_01 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2029_01_cid_principal_idx ON siasus.f_producao_ambulatorial_2029_01 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2029_01_cid_secundario_idx ON siasus.f_producao_ambulatorial_2029_01 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2029_01_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2029_01 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2029_01_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2029_01 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2029_01_municipio_id_idx ON siasus.f_producao_ambulatorial_2029_01 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2029_01_sexo_id_idx ON siasus.f_producao_ambulatorial_2029_01 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2029_01_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2029_01 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2029_01_uf_id_idx ON siasus.f_producao_ambulatorial_2029_01 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2029_01_uuid_idx ON siasus.f_producao_ambulatorial_2029_01 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2029_0_competencia_processamento_id_idx ON siasus.f_producao_ambulatorial_2029_01 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2029_02 definição

CREATE TABLE siasus.f_producao_ambulatorial_2029_02 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202902) TO (202903);
CREATE INDEX f_producao_ambulatorial_2029_02_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2029_02 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2029_02_cid_principal_idx ON siasus.f_producao_ambulatorial_2029_02 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2029_02_cid_secundario_idx ON siasus.f_producao_ambulatorial_2029_02 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2029_02_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2029_02 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2029_02_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2029_02 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2029_02_municipio_id_idx ON siasus.f_producao_ambulatorial_2029_02 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2029_02_sexo_id_idx ON siasus.f_producao_ambulatorial_2029_02 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2029_02_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2029_02 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2029_02_uf_id_idx ON siasus.f_producao_ambulatorial_2029_02 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2029_02_uuid_idx ON siasus.f_producao_ambulatorial_2029_02 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2029__competencia_processamento_id_idx1 ON siasus.f_producao_ambulatorial_2029_02 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2029_03 definição

CREATE TABLE siasus.f_producao_ambulatorial_2029_03 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202903) TO (202904);
CREATE INDEX f_producao_ambulatorial_2029_03_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2029_03 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2029_03_cid_principal_idx ON siasus.f_producao_ambulatorial_2029_03 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2029_03_cid_secundario_idx ON siasus.f_producao_ambulatorial_2029_03 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2029_03_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2029_03 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2029_03_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2029_03 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2029_03_municipio_id_idx ON siasus.f_producao_ambulatorial_2029_03 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2029_03_sexo_id_idx ON siasus.f_producao_ambulatorial_2029_03 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2029_03_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2029_03 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2029_03_uf_id_idx ON siasus.f_producao_ambulatorial_2029_03 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2029_03_uuid_idx ON siasus.f_producao_ambulatorial_2029_03 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2029__competencia_processamento_id_idx2 ON siasus.f_producao_ambulatorial_2029_03 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2029_04 definição

CREATE TABLE siasus.f_producao_ambulatorial_2029_04 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202904) TO (202905);
CREATE INDEX f_producao_ambulatorial_2029_04_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2029_04 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2029_04_cid_principal_idx ON siasus.f_producao_ambulatorial_2029_04 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2029_04_cid_secundario_idx ON siasus.f_producao_ambulatorial_2029_04 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2029_04_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2029_04 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2029_04_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2029_04 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2029_04_municipio_id_idx ON siasus.f_producao_ambulatorial_2029_04 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2029_04_sexo_id_idx ON siasus.f_producao_ambulatorial_2029_04 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2029_04_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2029_04 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2029_04_uf_id_idx ON siasus.f_producao_ambulatorial_2029_04 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2029_04_uuid_idx ON siasus.f_producao_ambulatorial_2029_04 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2029__competencia_processamento_id_idx3 ON siasus.f_producao_ambulatorial_2029_04 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2029_05 definição

CREATE TABLE siasus.f_producao_ambulatorial_2029_05 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202905) TO (202906);
CREATE INDEX f_producao_ambulatorial_2029_05_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2029_05 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2029_05_cid_principal_idx ON siasus.f_producao_ambulatorial_2029_05 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2029_05_cid_secundario_idx ON siasus.f_producao_ambulatorial_2029_05 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2029_05_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2029_05 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2029_05_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2029_05 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2029_05_municipio_id_idx ON siasus.f_producao_ambulatorial_2029_05 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2029_05_sexo_id_idx ON siasus.f_producao_ambulatorial_2029_05 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2029_05_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2029_05 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2029_05_uf_id_idx ON siasus.f_producao_ambulatorial_2029_05 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2029_05_uuid_idx ON siasus.f_producao_ambulatorial_2029_05 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2029__competencia_processamento_id_idx4 ON siasus.f_producao_ambulatorial_2029_05 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2029_06 definição

CREATE TABLE siasus.f_producao_ambulatorial_2029_06 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202906) TO (202907);
CREATE INDEX f_producao_ambulatorial_2029_06_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2029_06 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2029_06_cid_principal_idx ON siasus.f_producao_ambulatorial_2029_06 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2029_06_cid_secundario_idx ON siasus.f_producao_ambulatorial_2029_06 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2029_06_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2029_06 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2029_06_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2029_06 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2029_06_municipio_id_idx ON siasus.f_producao_ambulatorial_2029_06 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2029_06_sexo_id_idx ON siasus.f_producao_ambulatorial_2029_06 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2029_06_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2029_06 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2029_06_uf_id_idx ON siasus.f_producao_ambulatorial_2029_06 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2029_06_uuid_idx ON siasus.f_producao_ambulatorial_2029_06 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2029__competencia_processamento_id_idx5 ON siasus.f_producao_ambulatorial_2029_06 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2029_07 definição

CREATE TABLE siasus.f_producao_ambulatorial_2029_07 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202907) TO (202908);
CREATE INDEX f_producao_ambulatorial_2029_07_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2029_07 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2029_07_cid_principal_idx ON siasus.f_producao_ambulatorial_2029_07 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2029_07_cid_secundario_idx ON siasus.f_producao_ambulatorial_2029_07 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2029_07_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2029_07 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2029_07_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2029_07 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2029_07_municipio_id_idx ON siasus.f_producao_ambulatorial_2029_07 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2029_07_sexo_id_idx ON siasus.f_producao_ambulatorial_2029_07 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2029_07_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2029_07 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2029_07_uf_id_idx ON siasus.f_producao_ambulatorial_2029_07 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2029_07_uuid_idx ON siasus.f_producao_ambulatorial_2029_07 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2029__competencia_processamento_id_idx6 ON siasus.f_producao_ambulatorial_2029_07 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2029_08 definição

CREATE TABLE siasus.f_producao_ambulatorial_2029_08 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202908) TO (202909);
CREATE INDEX f_producao_ambulatorial_2029_08_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2029_08 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2029_08_cid_principal_idx ON siasus.f_producao_ambulatorial_2029_08 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2029_08_cid_secundario_idx ON siasus.f_producao_ambulatorial_2029_08 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2029_08_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2029_08 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2029_08_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2029_08 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2029_08_municipio_id_idx ON siasus.f_producao_ambulatorial_2029_08 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2029_08_sexo_id_idx ON siasus.f_producao_ambulatorial_2029_08 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2029_08_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2029_08 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2029_08_uf_id_idx ON siasus.f_producao_ambulatorial_2029_08 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2029_08_uuid_idx ON siasus.f_producao_ambulatorial_2029_08 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2029__competencia_processamento_id_idx7 ON siasus.f_producao_ambulatorial_2029_08 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2029_09 definição

CREATE TABLE siasus.f_producao_ambulatorial_2029_09 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202909) TO (202910);
CREATE INDEX f_producao_ambulatorial_2029_09_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2029_09 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2029_09_cid_principal_idx ON siasus.f_producao_ambulatorial_2029_09 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2029_09_cid_secundario_idx ON siasus.f_producao_ambulatorial_2029_09 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2029_09_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2029_09 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2029_09_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2029_09 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2029_09_municipio_id_idx ON siasus.f_producao_ambulatorial_2029_09 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2029_09_sexo_id_idx ON siasus.f_producao_ambulatorial_2029_09 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2029_09_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2029_09 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2029_09_uf_id_idx ON siasus.f_producao_ambulatorial_2029_09 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2029_09_uuid_idx ON siasus.f_producao_ambulatorial_2029_09 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2029__competencia_processamento_id_idx8 ON siasus.f_producao_ambulatorial_2029_09 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2029_10 definição

CREATE TABLE siasus.f_producao_ambulatorial_2029_10 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202910) TO (202911);
CREATE INDEX f_producao_ambulatorial_2029_10_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2029_10 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2029_10_cid_principal_idx ON siasus.f_producao_ambulatorial_2029_10 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2029_10_cid_secundario_idx ON siasus.f_producao_ambulatorial_2029_10 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2029_10_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2029_10 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2029_10_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2029_10 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2029_10_municipio_id_idx ON siasus.f_producao_ambulatorial_2029_10 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2029_10_sexo_id_idx ON siasus.f_producao_ambulatorial_2029_10 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2029_10_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2029_10 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2029_10_uf_id_idx ON siasus.f_producao_ambulatorial_2029_10 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2029_10_uuid_idx ON siasus.f_producao_ambulatorial_2029_10 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2029_1_competencia_processamento_id_idx ON siasus.f_producao_ambulatorial_2029_10 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2029_11 definição

CREATE TABLE siasus.f_producao_ambulatorial_2029_11 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202911) TO (202912);
CREATE INDEX f_producao_ambulatorial_2029_11_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2029_11 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2029_11_cid_principal_idx ON siasus.f_producao_ambulatorial_2029_11 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2029_11_cid_secundario_idx ON siasus.f_producao_ambulatorial_2029_11 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2029_11_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2029_11 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2029_11_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2029_11 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2029_11_municipio_id_idx ON siasus.f_producao_ambulatorial_2029_11 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2029_11_sexo_id_idx ON siasus.f_producao_ambulatorial_2029_11 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2029_11_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2029_11 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2029_11_uf_id_idx ON siasus.f_producao_ambulatorial_2029_11 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2029_11_uuid_idx ON siasus.f_producao_ambulatorial_2029_11 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2029__competencia_processamento_id_idx9 ON siasus.f_producao_ambulatorial_2029_11 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2029_12 definição

CREATE TABLE siasus.f_producao_ambulatorial_2029_12 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (202912) TO (203001);
CREATE INDEX f_producao_ambulatorial_2029_12_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2029_12 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2029_12_cid_principal_idx ON siasus.f_producao_ambulatorial_2029_12 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2029_12_cid_secundario_idx ON siasus.f_producao_ambulatorial_2029_12 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2029_12_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2029_12 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2029_12_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2029_12 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2029_12_municipio_id_idx ON siasus.f_producao_ambulatorial_2029_12 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2029_12_sexo_id_idx ON siasus.f_producao_ambulatorial_2029_12 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2029_12_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2029_12 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2029_12_uf_id_idx ON siasus.f_producao_ambulatorial_2029_12 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2029_12_uuid_idx ON siasus.f_producao_ambulatorial_2029_12 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2029_competencia_processamento_id_idx10 ON siasus.f_producao_ambulatorial_2029_12 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2030_01 definição

CREATE TABLE siasus.f_producao_ambulatorial_2030_01 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (203001) TO (203002);
CREATE INDEX f_producao_ambulatorial_2030_01_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2030_01 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2030_01_cid_principal_idx ON siasus.f_producao_ambulatorial_2030_01 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2030_01_cid_secundario_idx ON siasus.f_producao_ambulatorial_2030_01 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2030_01_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2030_01 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2030_01_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2030_01 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2030_01_municipio_id_idx ON siasus.f_producao_ambulatorial_2030_01 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2030_01_sexo_id_idx ON siasus.f_producao_ambulatorial_2030_01 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2030_01_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2030_01 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2030_01_uf_id_idx ON siasus.f_producao_ambulatorial_2030_01 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2030_01_uuid_idx ON siasus.f_producao_ambulatorial_2030_01 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2030_0_competencia_processamento_id_idx ON siasus.f_producao_ambulatorial_2030_01 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2030_02 definição

CREATE TABLE siasus.f_producao_ambulatorial_2030_02 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (203002) TO (203003);
CREATE INDEX f_producao_ambulatorial_2030_02_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2030_02 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2030_02_cid_principal_idx ON siasus.f_producao_ambulatorial_2030_02 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2030_02_cid_secundario_idx ON siasus.f_producao_ambulatorial_2030_02 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2030_02_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2030_02 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2030_02_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2030_02 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2030_02_municipio_id_idx ON siasus.f_producao_ambulatorial_2030_02 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2030_02_sexo_id_idx ON siasus.f_producao_ambulatorial_2030_02 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2030_02_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2030_02 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2030_02_uf_id_idx ON siasus.f_producao_ambulatorial_2030_02 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2030_02_uuid_idx ON siasus.f_producao_ambulatorial_2030_02 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2030__competencia_processamento_id_idx1 ON siasus.f_producao_ambulatorial_2030_02 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2030_03 definição

CREATE TABLE siasus.f_producao_ambulatorial_2030_03 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (203003) TO (203004);
CREATE INDEX f_producao_ambulatorial_2030_03_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2030_03 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2030_03_cid_principal_idx ON siasus.f_producao_ambulatorial_2030_03 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2030_03_cid_secundario_idx ON siasus.f_producao_ambulatorial_2030_03 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2030_03_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2030_03 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2030_03_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2030_03 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2030_03_municipio_id_idx ON siasus.f_producao_ambulatorial_2030_03 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2030_03_sexo_id_idx ON siasus.f_producao_ambulatorial_2030_03 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2030_03_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2030_03 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2030_03_uf_id_idx ON siasus.f_producao_ambulatorial_2030_03 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2030_03_uuid_idx ON siasus.f_producao_ambulatorial_2030_03 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2030__competencia_processamento_id_idx2 ON siasus.f_producao_ambulatorial_2030_03 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2030_04 definição

CREATE TABLE siasus.f_producao_ambulatorial_2030_04 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (203004) TO (203005);
CREATE INDEX f_producao_ambulatorial_2030_04_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2030_04 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2030_04_cid_principal_idx ON siasus.f_producao_ambulatorial_2030_04 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2030_04_cid_secundario_idx ON siasus.f_producao_ambulatorial_2030_04 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2030_04_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2030_04 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2030_04_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2030_04 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2030_04_municipio_id_idx ON siasus.f_producao_ambulatorial_2030_04 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2030_04_sexo_id_idx ON siasus.f_producao_ambulatorial_2030_04 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2030_04_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2030_04 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2030_04_uf_id_idx ON siasus.f_producao_ambulatorial_2030_04 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2030_04_uuid_idx ON siasus.f_producao_ambulatorial_2030_04 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2030__competencia_processamento_id_idx3 ON siasus.f_producao_ambulatorial_2030_04 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2030_05 definição

CREATE TABLE siasus.f_producao_ambulatorial_2030_05 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (203005) TO (203006);
CREATE INDEX f_producao_ambulatorial_2030_05_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2030_05 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2030_05_cid_principal_idx ON siasus.f_producao_ambulatorial_2030_05 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2030_05_cid_secundario_idx ON siasus.f_producao_ambulatorial_2030_05 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2030_05_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2030_05 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2030_05_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2030_05 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2030_05_municipio_id_idx ON siasus.f_producao_ambulatorial_2030_05 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2030_05_sexo_id_idx ON siasus.f_producao_ambulatorial_2030_05 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2030_05_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2030_05 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2030_05_uf_id_idx ON siasus.f_producao_ambulatorial_2030_05 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2030_05_uuid_idx ON siasus.f_producao_ambulatorial_2030_05 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2030__competencia_processamento_id_idx4 ON siasus.f_producao_ambulatorial_2030_05 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2030_06 definição

CREATE TABLE siasus.f_producao_ambulatorial_2030_06 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (203006) TO (203007);
CREATE INDEX f_producao_ambulatorial_2030_06_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2030_06 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2030_06_cid_principal_idx ON siasus.f_producao_ambulatorial_2030_06 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2030_06_cid_secundario_idx ON siasus.f_producao_ambulatorial_2030_06 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2030_06_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2030_06 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2030_06_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2030_06 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2030_06_municipio_id_idx ON siasus.f_producao_ambulatorial_2030_06 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2030_06_sexo_id_idx ON siasus.f_producao_ambulatorial_2030_06 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2030_06_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2030_06 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2030_06_uf_id_idx ON siasus.f_producao_ambulatorial_2030_06 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2030_06_uuid_idx ON siasus.f_producao_ambulatorial_2030_06 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2030__competencia_processamento_id_idx5 ON siasus.f_producao_ambulatorial_2030_06 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2030_07 definição

CREATE TABLE siasus.f_producao_ambulatorial_2030_07 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (203007) TO (203008);
CREATE INDEX f_producao_ambulatorial_2030_07_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2030_07 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2030_07_cid_principal_idx ON siasus.f_producao_ambulatorial_2030_07 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2030_07_cid_secundario_idx ON siasus.f_producao_ambulatorial_2030_07 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2030_07_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2030_07 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2030_07_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2030_07 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2030_07_municipio_id_idx ON siasus.f_producao_ambulatorial_2030_07 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2030_07_sexo_id_idx ON siasus.f_producao_ambulatorial_2030_07 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2030_07_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2030_07 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2030_07_uf_id_idx ON siasus.f_producao_ambulatorial_2030_07 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2030_07_uuid_idx ON siasus.f_producao_ambulatorial_2030_07 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2030__competencia_processamento_id_idx6 ON siasus.f_producao_ambulatorial_2030_07 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2030_08 definição

CREATE TABLE siasus.f_producao_ambulatorial_2030_08 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (203008) TO (203009);
CREATE INDEX f_producao_ambulatorial_2030_08_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2030_08 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2030_08_cid_principal_idx ON siasus.f_producao_ambulatorial_2030_08 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2030_08_cid_secundario_idx ON siasus.f_producao_ambulatorial_2030_08 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2030_08_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2030_08 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2030_08_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2030_08 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2030_08_municipio_id_idx ON siasus.f_producao_ambulatorial_2030_08 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2030_08_sexo_id_idx ON siasus.f_producao_ambulatorial_2030_08 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2030_08_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2030_08 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2030_08_uf_id_idx ON siasus.f_producao_ambulatorial_2030_08 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2030_08_uuid_idx ON siasus.f_producao_ambulatorial_2030_08 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2030__competencia_processamento_id_idx7 ON siasus.f_producao_ambulatorial_2030_08 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2030_09 definição

CREATE TABLE siasus.f_producao_ambulatorial_2030_09 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (203009) TO (203010);
CREATE INDEX f_producao_ambulatorial_2030_09_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2030_09 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2030_09_cid_principal_idx ON siasus.f_producao_ambulatorial_2030_09 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2030_09_cid_secundario_idx ON siasus.f_producao_ambulatorial_2030_09 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2030_09_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2030_09 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2030_09_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2030_09 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2030_09_municipio_id_idx ON siasus.f_producao_ambulatorial_2030_09 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2030_09_sexo_id_idx ON siasus.f_producao_ambulatorial_2030_09 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2030_09_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2030_09 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2030_09_uf_id_idx ON siasus.f_producao_ambulatorial_2030_09 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2030_09_uuid_idx ON siasus.f_producao_ambulatorial_2030_09 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2030__competencia_processamento_id_idx8 ON siasus.f_producao_ambulatorial_2030_09 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2030_10 definição

CREATE TABLE siasus.f_producao_ambulatorial_2030_10 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (203010) TO (203011);
CREATE INDEX f_producao_ambulatorial_2030_10_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2030_10 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2030_10_cid_principal_idx ON siasus.f_producao_ambulatorial_2030_10 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2030_10_cid_secundario_idx ON siasus.f_producao_ambulatorial_2030_10 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2030_10_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2030_10 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2030_10_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2030_10 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2030_10_municipio_id_idx ON siasus.f_producao_ambulatorial_2030_10 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2030_10_sexo_id_idx ON siasus.f_producao_ambulatorial_2030_10 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2030_10_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2030_10 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2030_10_uf_id_idx ON siasus.f_producao_ambulatorial_2030_10 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2030_10_uuid_idx ON siasus.f_producao_ambulatorial_2030_10 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2030_1_competencia_processamento_id_idx ON siasus.f_producao_ambulatorial_2030_10 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2030_11 definição

CREATE TABLE siasus.f_producao_ambulatorial_2030_11 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (203011) TO (203012);
CREATE INDEX f_producao_ambulatorial_2030_11_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2030_11 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2030_11_cid_principal_idx ON siasus.f_producao_ambulatorial_2030_11 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2030_11_cid_secundario_idx ON siasus.f_producao_ambulatorial_2030_11 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2030_11_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2030_11 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2030_11_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2030_11 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2030_11_municipio_id_idx ON siasus.f_producao_ambulatorial_2030_11 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2030_11_sexo_id_idx ON siasus.f_producao_ambulatorial_2030_11 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2030_11_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2030_11 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2030_11_uf_id_idx ON siasus.f_producao_ambulatorial_2030_11 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2030_11_uuid_idx ON siasus.f_producao_ambulatorial_2030_11 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2030__competencia_processamento_id_idx9 ON siasus.f_producao_ambulatorial_2030_11 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial_2030_12 definição

CREATE TABLE siasus.f_producao_ambulatorial_2030_12 PARTITION OF siasus.f_producao_ambulatorial  FOR VALUES FROM (203012) TO (203101);
CREATE INDEX f_producao_ambulatorial_2030_12_cid_causas_associadas_idx ON siasus.f_producao_ambulatorial_2030_12 USING btree (cid_causas_associadas);
CREATE INDEX f_producao_ambulatorial_2030_12_cid_principal_idx ON siasus.f_producao_ambulatorial_2030_12 USING btree (cid_principal);
CREATE INDEX f_producao_ambulatorial_2030_12_cid_secundario_idx ON siasus.f_producao_ambulatorial_2030_12 USING btree (cid_secundario);
CREATE INDEX f_producao_ambulatorial_2030_12_cnes_estabelecimento_id_idx ON siasus.f_producao_ambulatorial_2030_12 USING btree (cnes_estabelecimento_id);
CREATE INDEX f_producao_ambulatorial_2030_12_competencia_realizacao_id_idx ON siasus.f_producao_ambulatorial_2030_12 USING btree (competencia_realizacao_id);
CREATE INDEX f_producao_ambulatorial_2030_12_municipio_id_idx ON siasus.f_producao_ambulatorial_2030_12 USING btree (municipio_id);
CREATE INDEX f_producao_ambulatorial_2030_12_sexo_id_idx ON siasus.f_producao_ambulatorial_2030_12 USING btree (sexo_id);
CREATE INDEX f_producao_ambulatorial_2030_12_sigtap_procedimento_id_idx ON siasus.f_producao_ambulatorial_2030_12 USING btree (sigtap_procedimento_id);
CREATE INDEX f_producao_ambulatorial_2030_12_uf_id_idx ON siasus.f_producao_ambulatorial_2030_12 USING btree (uf_id);
CREATE INDEX f_producao_ambulatorial_2030_12_uuid_idx ON siasus.f_producao_ambulatorial_2030_12 USING btree (uuid);
CREATE INDEX f_producao_ambulatorial_2030_competencia_processamento_id_idx10 ON siasus.f_producao_ambulatorial_2030_12 USING btree (competencia_processamento_id);


-- siasus.f_producao_ambulatorial chaves estrangeiras

ALTER TABLE siasus.f_producao_ambulatorial ADD CONSTRAINT fk_fproducaoambulatorial_dcnesestabelecimento FOREIGN KEY (cnes_estabelecimento_id) REFERENCES cnes.d_estabelecimento(id);
ALTER TABLE siasus.f_producao_ambulatorial ADD CONSTRAINT fk_fproducaoambulatorial_dcompetenciaprocessamento FOREIGN KEY (competencia_processamento_id) REFERENCES public.d_competencia(id);
ALTER TABLE siasus.f_producao_ambulatorial ADD CONSTRAINT fk_fproducaoambulatorial_dcompetenciarealizacao FOREIGN KEY (competencia_realizacao_id) REFERENCES public.d_competencia(id);
ALTER TABLE siasus.f_producao_ambulatorial ADD CONSTRAINT fk_fproducaoambulatorial_dmunicipio FOREIGN KEY (municipio_id) REFERENCES public.d_municipio(id);
ALTER TABLE siasus.f_producao_ambulatorial ADD CONSTRAINT fk_fproducaoambulatorial_dsexo FOREIGN KEY (sexo_id) REFERENCES public.d_sexo(id);
ALTER TABLE siasus.f_producao_ambulatorial ADD CONSTRAINT fk_fproducaoambulatorial_dsigtapprocedimento FOREIGN KEY (sigtap_procedimento_id) REFERENCES sigtap.d_procedimento(id);
ALTER TABLE siasus.f_producao_ambulatorial ADD CONSTRAINT fk_fproducaoambulatorial_duf FOREIGN KEY (uf_id) REFERENCES public.d_uf(id);


-- siasus.f_producao_ambulatorial_2021_01 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2021_02 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2021_03 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2021_04 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2021_05 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2021_06 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2021_07 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2021_08 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2021_09 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2021_10 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2021_11 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2021_12 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2022_01 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2022_02 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2022_03 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2022_04 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2022_05 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2022_06 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2022_07 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2022_08 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2022_09 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2022_10 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2022_11 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2022_12 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2023_01 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2023_02 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2023_03 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2023_04 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2023_05 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2023_06 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2023_07 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2023_08 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2023_09 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2023_10 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2023_11 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2023_12 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2024_01 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2024_02 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2024_03 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2024_04 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2024_05 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2024_06 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2024_07 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2024_08 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2024_09 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2024_10 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2024_11 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2024_12 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2025_01 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2025_02 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2025_03 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2025_04 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2025_05 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2025_06 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2025_07 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2025_08 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2025_09 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2025_10 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2025_11 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2025_12 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2026_01 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2026_02 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2026_03 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2026_04 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2026_05 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2026_06 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2026_07 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2026_08 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2026_09 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2026_10 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2026_11 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2026_12 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2027_01 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2027_02 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2027_03 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2027_04 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2027_05 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2027_06 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2027_07 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2027_08 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2027_09 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2027_10 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2027_11 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2027_12 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2028_01 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2028_02 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2028_03 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2028_04 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2028_05 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2028_06 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2028_07 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2028_08 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2028_09 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2028_10 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2028_11 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2028_12 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2029_01 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2029_02 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2029_03 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2029_04 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2029_05 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2029_06 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2029_07 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2029_08 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2029_09 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2029_10 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2029_11 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2029_12 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2030_01 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2030_02 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2030_03 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2030_04 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2030_05 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2030_06 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2030_07 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2030_08 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2030_09 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2030_10 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2030_11 chaves estrangeiras

-- siasus.f_producao_ambulatorial_2030_12 chaves estrangeiras;