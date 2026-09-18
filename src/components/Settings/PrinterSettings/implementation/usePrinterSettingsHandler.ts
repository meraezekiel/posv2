import { useCallback } from 'react';

import { PRINTER_DEVICES } from '@/domain/settings';
import { usePosStore } from '@/store/pos-store';
import { useUiStore } from '@/store/ui-store';

export function usePrinterSettingsHandler() {
  const { printer, setPrinter, showGlobalToast } = usePosStore();
  const { runBusy } = useUiStore();

  const paired = printer.status === 'paired';

  const search = useCallback(() => {
    setPrinter({ status: 'scanning', devices: [] });
    // A real scan takes a moment; the mock lists the two known printers.
    setTimeout(() => setPrinter({ status: paired ? 'paired' : 'none', devices: PRINTER_DEVICES }), 1400);
  }, [paired, setPrinter]);

  const testPage = useCallback(() => {
    if (!paired) {
      showGlobalToast('Pair a printer first');
      return;
    }
    runBusy('Printing test page…', 1200, () => showGlobalToast('Test page sent'));
  }, [paired, runBusy, showGlobalToast]);

  return {
    status:
      printer.status === 'paired'
        ? 'Paired · POS-58 Thermal'
        : printer.status === 'scanning'
          ? 'Searching for printers…'
          : 'No printer paired',
    sub: paired
      ? `${printer.paper} mm paper · ${printer.auto ? 'auto-print on' : 'auto-print off'}`
      : 'Turn the printer on and keep it within a metre of the phone.',
    paired,
    searchLabel:
      printer.status === 'scanning' ? 'Searching…' : paired ? 'Search again' : 'Search for printers',
    search,
    devices: printer.devices.map((name) => {
      const isPaired = paired && name === 'POS-58 Thermal';
      return {
        name,
        sub: name === 'POS-58 Thermal' ? '58 mm · seen before' : '80 mm · new device',
        action: isPaired ? 'Paired' : 'Pair',
        paired: isPaired,
        pair: () =>
          runBusy(`Pairing ${name}…`, 1100, () => {
            setPrinter({ status: 'paired', paper: name === 'POS-58 Thermal' ? '58' : '80' });
            showGlobalToast(`${name} paired`);
          }),
      };
    }),
    paperOptions: [
      { key: '58', label: '58 mm' },
      { key: '80', label: '80 mm' },
    ],
    paper: printer.paper,
    setPaper: (key: string) => setPrinter({ paper: key as '58' | '80' }),
    auto: printer.auto,
    toggleAuto: () => setPrinter({ auto: !printer.auto }),
    testPage,
  };
}
