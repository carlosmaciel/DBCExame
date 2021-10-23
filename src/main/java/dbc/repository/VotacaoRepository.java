package dbc.repository;

import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import dbc.model.Associados;
import dbc.model.Pautas;
import dbc.model.Votacoes;

public interface VotacaoRepository extends JpaRepository<Votacoes, Long>{
	
	@Query(value="SELECT ID_PAUTA AS idPauta, SUM(CASE WHEN VOTO = 1 THEN 1 ELSE 0 END) AS sim, SUM(CASE WHEN VOTO = 0 THEN 1 ELSE 0 END) AS nao from VOTACOES v where v.ID_PAUTA = :idPauta GROUP BY ID_PAUTA", nativeQuery=true)
	Map<String, Object> informarResultado(Long idPauta);	
	
	Votacoes findByPautaAndAssociado(Pautas pauta, Associados associado);
}
