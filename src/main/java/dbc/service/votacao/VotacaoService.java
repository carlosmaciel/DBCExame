package dbc.service.votacao;

import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;

import dbc.dto.Resultados;
import dbc.dto.ValidacaoCPF;
import dbc.exception.VotacaoException;
import dbc.model.Associados;
import dbc.model.Pautas;
import dbc.model.Votacoes;
import dbc.repository.VotacaoRepository;
import dbc.webservice.RestService;

@Service
public class VotacaoService implements IVotacaoService {

	@Autowired
	private VotacaoRepository votacaoRepository;
	
	private Logger logger = Logger.getLogger(VotacaoService.class);

	@Override
	public Votacoes votar(Pautas pauta, Associados associado, int voto) throws Exception{
				
		logger.info("Verificando se CPF já votou.");
		Votacoes verificaVoto = verificaVotoAssociado(pauta, associado);
				
		if(verificaVoto != null)
			throw new VotacaoException("Associado já votou nesta pauta!");
				
		logger.info("Validando CPF " + associado.getCpf() + " em API REST.");		
		ValidacaoCPF valida = validarCPF(associado.getCpf());
		
		if(valida.getStatus().equalsIgnoreCase("UNABLE_TO_VOTE"))
			throw new VotacaoException ("O associado não está apto para votar.");  
		
		logger.info("CPF apto para votar.");	
		Votacoes votacao = new Votacoes(pauta, associado, voto);
		
		return votacaoRepository.saveAndFlush(votacao);
	}

	private Votacoes verificaVotoAssociado(Pautas pauta, Associados associado) throws Exception{
		return votacaoRepository.findByPautaAndAssociado(pauta, associado);
	}

	@Override
	public Resultados informarResultado(Long idPauta) throws VotacaoException {
		
		Map<String, Object> map = votacaoRepository.informarResultado(idPauta);
				
		if(map == null) {
			throw new VotacaoException ("Nenhuma pauta foi encontrada.");
		} 
		
		Resultados resultado = new Resultados();
		logger.info("Resultado da pauta " + idPauta + ": SIM: " + resultado.getSim() + ", NAO: " + resultado.getNao());
		
		if (map.isEmpty()) {
			resultado.setIdPauta(idPauta);
			resultado.setSim(0);
			resultado.setNao(0);
		} else {
			resultado.setIdPauta(Long.parseLong(map.get("idPauta").toString()));
			resultado.setSim(Integer.parseInt(map.get("sim").toString()));
			resultado.setNao(Integer.parseInt(map.get("nao").toString()));
		}
		
		return resultado;
	}
	
	public ValidacaoCPF validarCPF(String cpf) throws RestClientException {
		RestService rest = new RestService();
		return rest.consumir(cpf);
	}

}