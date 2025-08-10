import {rtlWorkerPlugin} from '../source/rtl_text_plugin_worker';

import type {SymbolStyleLayer} from '../style/style_layer/symbol_style_layer';
import type {Feature} from '@maplibre/maplibre-gl-style-spec';
import {type Formatted} from '@maplibre/maplibre-gl-style-spec';

/* Kurdish ligature constants */
const connectors = '[\u0628\u062A\u062B\u062C\u062D\u062E\u0633\u0634\u0635\u0636\u0637\u0638\u0639\u063A\u0641\u0642\u0643\u0644\u0645\u0646\u0647\u064A\u06A9\u06B5]';
const connectorRegEx = new RegExp(`(?<=${connectors})ڵا`, 'g');
const isolate = '̌ﻻ';
const final = '̌ﻼ';

function transformTextInternal(text: string, layer: SymbolStyleLayer, feature: Feature) {
    const transform = layer.layout.get('text-transform').evaluate(feature, {});
    if (transform === 'uppercase') {
        text = text.toLocaleUpperCase();
    } else if (transform === 'lowercase') {
        text = text.toLocaleLowerCase();
    }

    if (rtlWorkerPlugin.applyArabicShaping) {
        text = rtlWorkerPlugin.applyArabicShaping(text.replace(connectorRegEx, final)).replace(/̌ﻻ/g, final).replace(/ڵﺎ/g, isolate);
    }

    return text;
}

export function transformText(text: Formatted, layer: SymbolStyleLayer, feature: Feature): Formatted {
    text.sections.forEach(section => {
        section.text = transformTextInternal(section.text, layer, feature);
    });
    return text;
}
