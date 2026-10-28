import { FirstRun } from '../ui/FirstRun';
import firstRunStyles from '../ui/FirstRun.module.css';

/** IndexedDB indisponível (modo privado e alguns navegadores): os registros não ficariam salvos. */
export function PrivateModeScreen() {
  return (
    <FirstRun title="Neste modo, os registros não ficam salvos" docTitle="Modo privado">
      <p className={firstRunStyles.texto}>
        Parece que você abriu o app numa aba privada ou anônima. Nesse modo, o navegador apaga tudo
        quando a aba fecha, e o app não consegue guardar os teus registros.
      </p>
      <p className={firstRunStyles.texto}>
        Feche esta aba e abra o link de novo numa aba normal do Safari ou do Chrome. No Safari,
        toque no botão das abas e saia do modo Privado. No Chrome, abra uma aba que não seja
        anônima.
      </p>
    </FirstRun>
  );
}
