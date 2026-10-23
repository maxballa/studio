# Studio

Web app per studiare storia e geografia a blocchi brevi: anteprima, lettura con parole chiave, autoverifica a libro chiuso, pausa, quiz finale e ripasso lampo il giorno dopo.

## Come si aggiorna

I contenuti stanno nella cartella `data`:

- `sessioni.json`: le sessioni di studio, con pezzi, domande, parole chiave e quiz
- `orario.json`: orario della settimana, verifiche e interrogazioni
- `config.json`: ora di fine, minuti di pausa e di ripasso

Max manda in chat le foto delle pagine o dell'orario, Claude aggiorna questi file. L'app sul tablet scarica i dati nuovi alla prima apertura con internet.

I progressi (parole chiave, autoverifiche, quiz, registro) restano salvati solo sul tablet.
