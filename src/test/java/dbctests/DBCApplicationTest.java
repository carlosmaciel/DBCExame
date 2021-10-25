package dbctests;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.rules.ExpectedException;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.HttpClientErrorException;

import dbc.dto.ValidacaoCPF;
import dbc.exception.VotacaoException;
import dbc.model.Associados;
import dbc.model.Pautas;
import dbc.model.Votacoes;
import dbc.repository.VotacaoRepository;
import dbc.service.votacao.VotacaoService;
import dbc.webservice.RestService;

@ExtendWith(MockitoExtension.class)
public class DBCApplicationTest {
	
	@Rule
	public ExpectedException exceptionRule = ExpectedException.none();
		
	@Mock
	private VotacaoRepository votacaoRepository;
	
	@InjectMocks
	private VotacaoService votacaoService;
	
	@Before
	public void createMocks() {
	    MockitoAnnotations.initMocks(this);
	}
		
	@Test
	public void deveValidarCPF() throws Exception {
		RestService rest = new RestService();
		String cpf1 = "10919794726"; //CORRECT CPF

		ValidacaoCPF valida = rest.consumir(cpf1);
		boolean validaCPF = (valida.getStatus().equals("ABLE_TO_VOTE") || valida.getStatus().equals("UNABLE_TO_VOTE"));
		assertEquals(true, validaCPF);
	}
	
	@Test
	public void deveRetorarErro404() {
		String cpf = "12345678991"; //ANY CPF
		exceptionRule.expect(HttpClientErrorException.class);
		exceptionRule.expectMessage("404 NOT_FOUND");
		RestService rest = new RestService();
		
		try {
			rest.consumir(cpf);
		} catch (HttpClientErrorException e) {
			throw new HttpClientErrorException(HttpStatus.NOT_FOUND);
		}			
	}
	
	@Test
	public void deveRetornarErroResultado() throws VotacaoException {		
		Long idPauta = 111111111111L;
		exceptionRule.expect(VotacaoException.class);
		exceptionRule.expectMessage("Nenhuma pauta foi encontrada.");
		when(votacaoRepository.informarResultado(idPauta)).thenReturn(null);
		
		votacaoService.informarResultado(idPauta);		
		verify(votacaoService).informarResultado(idPauta);
	}
	
	@Test
	public void deveRetornarErroAssociadoVotacao() throws Exception {		
		Pautas pauta = new Pautas ("Pauta 1");
		Associados associado = new Associados("Associado 1", "12345678945");
		Votacoes votacao = new Votacoes(pauta, associado, 0);
		exceptionRule.expect(VotacaoException.class);
		exceptionRule.expectMessage("Associado já votou nesta pauta!");
		when(votacaoRepository.findByPautaAndAssociado(pauta, associado)).thenReturn(votacao);
		
		votacaoService.votar(pauta, associado, 0);
		verify(votacaoService).votar(pauta, associado, 0);
	}

}
