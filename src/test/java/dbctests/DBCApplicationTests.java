package dbctests;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import dbc.service.pauta.PautaService;
import junit.framework.TestCase;

@RunWith(SpringRunner.class)
@SpringBootTest
public class DBCApplicationTests extends TestCase {

	public DBCApplicationTests() {
	}
	
	@Test
	public void naoDeveRetornarErro() {
		PautaService pautaService = new PautaService();
		int i = 1;
		assertEquals(i, 1);
	}

}
