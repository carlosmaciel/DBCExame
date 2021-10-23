package dbc.service.votacao;

import dbc.dto.Resultados;
import dbc.dto.ValidacaoCPF;
import dbc.model.Associados;
import dbc.model.Pautas;
import dbc.model.Votacoes;

public interface IVotacaoService {
	
	Votacoes votar(Pautas pauta, Associados associado, int voto) throws Exception;
		
	Resultados informarResultado (Long idPauta) throws Exception;
	
	ValidacaoCPF validarCPF(String cpf) throws Exception;

}