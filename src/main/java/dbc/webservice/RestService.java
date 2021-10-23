package dbc.webservice;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

import dbc.dto.ValidacaoCPF;

public class RestService {
		
	@Bean
	public RestTemplate restTemplate(RestTemplateBuilder builder) {
		return builder.build();
	}
	
	public ValidacaoCPF consumir(String cpf) throws Exception {	
		RestTemplate restTemplate = new RestTemplate();
		return restTemplate.getForObject(
				"https://user-info.herokuapp.com/users/" + cpf, ValidacaoCPF.class);
	}	
	
}
