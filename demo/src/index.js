import Mirador from 'mirador/dist/es/src/index';
import textOverlayPlugin from '../../src';
import { miradorImageToolsPlugin } from "mirador-image-tools";

const config = {
  catalog: [
    { manifestId: 'https://iiif.europeana.eu/presentation/9200396/BibliographicResource_3000118436165/manifest', provider: 'Europeana (Annotations)' },
    { manifestId: 'https://wellcomelibrary.org/iiif/b19956435/manifest', provider: 'Wellcome Library (ALTO)' },
    { manifestId: 'https://iiif.wellcomecollection.org/presentation/b18035723', provider: 'Wellcome Library (ALTO)' },
    { manifestId: 'https://scta.info/iiif/graciliscommentary/lon/manifest', provider: 'SCTA (Annotations)' },
    { manifestId: 'https://purl.stanford.edu/fg165hz3589/iiif/manifest', provider: 'Stanford University Libraries (ALTO)' },
    { manifestId: 'http://localhost:8081/rc_web_war_exploded/iiif/api/presentation/3/3a0ff2c2-7126-43a1-9d90-8846254f74cf%252F00000001%252Fostalo01%252F00000010/manifest', provider: "BMB"},
  ],
  id: 'demo',
  window: {
    textOverlay: {
      enabled: true,
      selectable: true,
      visible: false,
    },
    imageToolsEnabled: true,
  },
  // windows: [{
  //
  // }],
};

Mirador.viewer(config, [
  ...textOverlayPlugin, miradorImageToolsPlugin,
]);
