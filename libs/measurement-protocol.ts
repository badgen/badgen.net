import ky from '../libs/ky'

type HitType = 'pageview' | 'screenview' | 'event' | 'transaction' | 'item' | 'social' | 'exception' | 'timing'
type Boolean = '0' | '1'

// https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
interface MeasurementParams {
  /** Protocol Version */
  v: '1';

  /** Tracking ID / Web Property ID */
  tid: string;

  /** Client ID */
  cid?: string;

  /** User ID */
  uid?: string;

  /** Hit Type */
  t?: HitType;

  /** Cache Buster */
  z?: string;

  /** Document location URL */
  dl?: string;

  /** Document Host Name */
  dh?: string;

  /** Document Path */
  dp?: string;

  /** Document Title */
  dt?: string;

  /** Event Category */
  ec?: string;

  /** Event Action */
  ea?: string;

  /** Event Label */
  el?: string;

  /** Event Value */
  ev?: number;

  /** Exception Description */
  exd?: string;

  /** Is Exception Fatal? */
  exf?: Boolean;
}

type MeasurementConfig = Partial<MeasurementParams>

export function measure (
  tid: MeasurementParams['tid'],
  config: MeasurementConfig = {},
): Measure {
  return new Measure({ tid, ...config })
}

class Measure {
  config: MeasurementConfig;

  constructor (config: MeasurementConfig = {}) {
    this.config = { v: '1', ...config }
  }

  set (this: Measure, config: MeasurementConfig): Measure {
    return new Measure({ ...this.config, ...config })
  }

  setCustomDimension (values: string[]): Measure {
    const config = Object.fromEntries(values.map((val, idx) => [`cd${idx}`, val]))
    return this.set(config)
  }

  setCustomMetrics (values: number[]): Measure {
    const config = Object.fromEntries(values.map((val, idx) => [`cm${idx}`, val]))
    return this.set(config)
  }

  send (this: Measure): void {
    const body = buildPayload(this.config)
    ky.post('https://www.google-analytics.com/collect', { body }).catch(console.error)
  }

  pageview (this: Measure, url: string | { dh: string, dp: string }): Measure {
    const config: MeasurementConfig = { t: 'pageview' }
    if (typeof url === 'string') {
      config.dl = url
    } else {
      config.dh = url.dh
      config.dp = url.dp
    }
    return this.set(config)
  }

  event (this: Measure, category: string, action: string, label?: string, value?: number): Measure {
    return this.set({
      t: 'event',
      ec: category,
      ea: action,
      el: label,
      ev: value
    })
  }

  exception (this: Measure, description: string, fatal: Boolean = '1'): Measure {
    return this.set({
      t: 'exception',
      exd: description,
      exf: fatal
    })
  }
}

function buildPayload (params: Partial<MeasurementParams>): string {
  const formated: Record<string, string> = {}
  Object.keys(params).forEach(key => {
    if (params[key] === undefined) return
    formated[key] = params[key]
  })

  return new URLSearchParams(formated).toString()
}

// https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide#batch
export function batchSend (measurements: Measure[]) {
  const body = measurements.map(m => buildPayload(m.config)).join('\n')
  ky.post('https://www.google-analytics.com/batch', { body }).catch(console.error)
}
