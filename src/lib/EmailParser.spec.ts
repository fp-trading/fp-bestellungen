import { get } from "svelte/store";
import { describe, expect, it } from "vitest";
import Address, { address } from "./Address";
import EmailParser from "./EmailParser";

const emailParser = new EmailParser()

describe('test email parser parses address', () => {
    it('parses name', () => {
        emailParser.parse(emailWithOneProduct)
        expect(get(address).name).toBe('Vitali Hebel')

        address.set(new Address())

        emailParser.parse(emailWithOneColoredProduct)
        expect(get(address).name).toBe('Andreas Marotti')
    })

    it('parses company', () => {
        emailParser.parse(emailWithCompany)
        expect(get(address).company).toBe('Elmek - Inhaber Stefan Küblbeck')

        address.set(new Address())

        emailParser.parse(emailWithOneProduct)
        expect(get(address).company).toBe('')
    })
})

const emailWithOneProduct = `Sehr geehrte Damen und Herren,


bitte folgende Bestellung an den Kunden liefern: #202224042.

Anzahl der Artikel: 1

Anzahl der Produkte: 1


Bestellung:

Artikel: StoLevell Novo - 15kg

Variante: 15kg

SKU: 00714-030

Anzahl: 1


Kunden Bestellanmerkungen:

Bitte eine Stunde vorher Avis: 0177 2702733


Wunschliefertermin:

23.08.2022


Lieferadresse:

Vitali Hebel |

Bonner Str. 44

Asbach,

53567

Deutschland

Adresszusatz:

Phone: 0177 2702733


Kunden Email:

vhebel@vhebel.de


Vielen Dank,

Ihr Farben-Profi Team
`


const emailWithOneColoredProduct = `Sehr geehrte Damen und Herren,


bitte folgende Bestellung an den Kunden liefern: #202224052.

Anzahl der Artikel: 1

Anzahl der Produkte: 1


Bestellung:

Artikel: StoColor Silco G - FK02 / 15L

Variante: FK02 / 15L

Produkteigenschaften:

Farbton: CPD1289
SKU: 00269-060

Anzahl: 1


Kunden Bestellanmerkungen:

Bitte eine Stunde vorher Avis: +49 176 22079309


Wunschliefertermin:

24.08.2022


Lieferadresse:

Andreas Marotti |

Frauenbergstraße 41

Bad Waldsee,

88339

Deutschland

Adresszusatz:

Phone: +49 176 22079309


Kunden Email:

andymaro83@hotmail.com


Vielen Dank,

Ihr Farben-Profi Team`



const emailWithCompany = `Sehr geehrte Damen und Herren,


bitte folgende Bestellung an den Kunden liefern: #202224054.

Anzahl der Artikel: 1

Anzahl der Produkte: 1


Bestellung:

Artikel: Sto-Putzgrund - natur / 7KG

Variante: natur / 7KG

Produkteigenschaften:

Farbton:
SKU: 00801-120

Anzahl: 1


Kunden Bestellanmerkungen:

Bitte eine Stunde vorher Avis: 0170 5335677


Wunschliefertermin:

24.08.2022


Lieferadresse:

Stefan Küblbeck | Elmek - Inhaber Stefan Küblbeck

Tannenstraße 1

Leinburg,

91227

Deutschland

Adresszusatz:

Phone: 0170 5335677


Kunden Email:

stefan.kueblbeck@t-online.de


Vielen Dank,

Ihr Farben-Profi Team`