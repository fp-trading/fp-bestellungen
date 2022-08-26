import { get } from "svelte/store";
import { beforeEach, describe, expect, it } from "vitest";
import Address, { address } from "./Address";
import EmailParser from "./EmailParser";
import Product from "./Product";
import { products } from "./ProductStore";

const emailParser = new EmailParser()

describe('test email parser parses address', () => {
    beforeEach(() => {
        address.set(new Address())
    })

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

    it('parses phone', () => {
        emailParser.parse(emailWithOneProduct)
        expect(get(address).phone).toBe('01772702733')

        address.set(new Address())

        emailParser.parse(emailWithOneColoredProduct)
        expect(get(address).phone).toBe('017622079309')
    })

    it('parses street', () => {
        emailParser.parse(emailWithOneProduct)
        expect(get(address).street).toBe('Bonner Str.')

        address.set(new Address())

        emailParser.parse(emailWithOneColoredProduct)
        expect(get(address).street).toBe('Frauenbergstraße')
    })

    it('parses street numbers', () => {
        emailParser.parse(emailWithOneProduct)
        expect(get(address).number).toBe('44')

        address.set(new Address())

        emailParser.parse(emailWithOneColoredProduct)
        expect(get(address).number).toBe('41 b')

        address.set(new Address())

        emailParser.parse(emailWithCompany)
        expect(get(address).number).toBe('1A')
    })

    it('parses zip code', () => {
        emailParser.parse(emailWithOneProduct)
        expect(get(address).zip).toBe('53567')

        address.set(new Address())

        emailParser.parse(emailWithOneColoredProduct)
        expect(get(address).zip).toBe('88339')
    })

    it('parses city', () => {
        emailParser.parse(emailWithOneProduct)
        expect(get(address).city).toBe('Asbach')

        address.set(new Address())

        emailParser.parse(emailWithOneColoredProduct)
        expect(get(address).city).toBe('Bad Waldsee')
    })
})

describe('test email parser parses products', () => {
    beforeEach(() => {
        products.set([])
    })

    it('parses sku from order with one item', () => {
        emailParser.parse(emailWithOneProduct)
        expect(get(products)[0].sku).toBe('00714-030')

        products.set([])

        emailParser.parse(emailWithOneColoredProduct)
        expect(get(products)[0].sku).toBe('00269-060')
    })

    it('parses sku from order with multiple items', () => {
        emailParser.parse(emailWithMultipleProducts)

        expect(get(products)[0].sku).toBe('00217-080')
        expect(get(products)[1].sku).toBe('00518-002')
    })

    it('parses color', () => {
        emailParser.parse(emailWithOneColoredProduct)
        expect(get(products)[0].color).toBe('CPD1289')

        products.set([])

        emailParser.parse(emailWithMultipleProducts)
        expect(get(products)[0].color).toBe('RAL7046')
        expect(get(products)[1].color).toBe('')
    })

    it('parses quantity', () => {
        emailParser.parse(emailWithOneProduct)
        expect(get(products)[0].quantity).toBe('1')

        products.set([])

        emailParser.parse(emailWithQuantity)
        expect(get(products)[0].quantity).toBe('6')
    })

    it('clears products before parse', () => {
        products.update(u => {
            u.push(new Product())

            return u
        })

        emailParser.parse(emailWithOneProduct)
        expect(get(products).length).toBe(1)
    })
})


describe('test error handle', () => {
    beforeEach(() => {
        products.set([])
        address.set(new Address())
    })

    it('throws correct error when address not there', () => {
        expect(() => {emailParser.parse(emailWithMissingAddress)}).toThrowError('Adresse nicht gefunden!')
    })

    it('throws correct error when address is broken', () => {
        expect(()=> {emailParser.parse(emailWithBrokenAddress)}).toThrowError('Adresse fehlerhaft!')
    })

    it('throws correct error when name is broken', () => {
        expect(() => {emailParser.parse(emailWithBrokenName)}).toThrowError('Name fehlerhaft!')

        const currentAddress = get(address)
        expect(currentAddress.name).toBe('')
        expect(currentAddress.company).toBe('')
        expect(currentAddress.phone).toBe('017664212576')
        expect(currentAddress.street).toBe('Rohrweg')
        expect(currentAddress.number).toBe('37')
        expect(currentAddress.zip).toBe('27449')
        expect(currentAddress.city).toBe('Kutenholz')
        expect(get(products).length).toBe(1)
    })

    it('throws correct error when company is broken', () => {
        expect(() => {emailParser.parse(emailWithBrokenCompany)}).toThrowError('Fehlendes "|" in der Namenzeile!')

        const currentAddress = get(address)
        expect(currentAddress.name).toBe('dimitri')
        expect(currentAddress.company).toBe('')
        expect(currentAddress.phone).toBe('017664212576')
        expect(currentAddress.street).toBe('Rohrweg')
        expect(currentAddress.number).toBe('37')
        expect(currentAddress.zip).toBe('27449')
        expect(currentAddress.city).toBe('Kutenholz')
        expect(get(products).length).toBe(1)
    })

    it('throws correct error when phone is missing', () => {
        expect(() => {emailParser.parse(emailWithMissingPhone)}).toThrowError('Telefonnummer fehlerhaft!')

        const currentAddress = get(address)
        expect(currentAddress.name).toBe('dimitri')
        expect(currentAddress.company).toBe('')
        expect(currentAddress.phone).toBe('')
        expect(currentAddress.street).toBe('Rohrweg')
        expect(currentAddress.number).toBe('37')
        expect(currentAddress.zip).toBe('27449')
        expect(currentAddress.city).toBe('Kutenholz')
        expect(get(products).length).toBe(1)
    })

    it('throws correct error when street is missing', () => {
        expect(() => {emailParser.parse(emailWithMissingStreet)}).toThrowError('Straße fehlerhaft!')

        const currentAddress = get(address)
        expect(currentAddress.name).toBe('dimitri')
        expect(currentAddress.company).toBe('')
        expect(currentAddress.phone).toBe('017664212576')
        expect(currentAddress.street).toBe('')
        expect(currentAddress.number).toBe('37')
        expect(currentAddress.zip).toBe('27449')
        expect(currentAddress.city).toBe('Kutenholz')
        expect(get(products).length).toBe(1)
    })

    it('throws correct error when street number is missing', () => {
        expect(() => {emailParser.parse(emailWithMissingStreetNumber)}).toThrowError('Hausnummer fehlerhaft!')

        const currentAddress = get(address)
        expect(currentAddress.name).toBe('dimitri')
        expect(currentAddress.company).toBe('')
        expect(currentAddress.phone).toBe('017664212576')
        expect(currentAddress.street).toBe('Rohrweg')
        expect(currentAddress.number).toBe('')
        expect(currentAddress.zip).toBe('27449')
        expect(currentAddress.city).toBe('Kutenholz')
        expect(get(products).length).toBe(1)
    })

    it('throws correct error when zip is missing', () => {
        expect(() => {emailParser.parse(emailWithMissingZip)}).toThrowError('Postleitzahl fehlerhaft!')

        const currentAddress = get(address)
        expect(currentAddress.name).toBe('dimitri')
        expect(currentAddress.company).toBe('')
        expect(currentAddress.phone).toBe('017664212576')
        expect(currentAddress.street).toBe('Rohrweg')
        expect(currentAddress.number).toBe('37')
        expect(currentAddress.zip).toBe('')
        expect(currentAddress.city).toBe('Kutenholz')
        expect(get(products).length).toBe(1)
    })

    it('throws correct error when city is missing', () => {
        expect(() => {emailParser.parse(emailWithMissingCity)}).toThrowError('Stadt fehlerhaft!')

        const currentAddress = get(address)
        expect(currentAddress.name).toBe('dimitri')
        expect(currentAddress.company).toBe('')
        expect(currentAddress.phone).toBe('017664212576')
        expect(currentAddress.street).toBe('Rohrweg')
        expect(currentAddress.number).toBe('37')
        expect(currentAddress.zip).toBe('27449')
        expect(currentAddress.city).toBe('')
        expect(get(products).length).toBe(1)
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

Frauenbergstraße 41 b

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

Tannenstraße 1A

Leinburg,

91227

Deutschland

Adresszusatz:

Phone: 0170 5335677


Kunden Email:

stefan.kueblbeck@t-online.de


Vielen Dank,

Ihr Farben-Profi Team`

const emailWithMultipleProducts = `Sehr geehrte Damen und Herren,


bitte folgende Bestellung an den Kunden liefern: #202224044.

Anzahl der Artikel: 2

Anzahl der Produkte: 2


Bestellung:

Artikel: StoColor Silco - FK01 / 5L

Variante: FK01 / 5L

Produkteigenschaften:

Farbton: RAL7046
SKU: 00217-080

Anzahl: 1


Artikel: StoPrim Plex - 20L

Variante: 20L

SKU: 00518-002

Anzahl: 1


Kunden Bestellanmerkungen:

Bitte eine Stunde vorher Avis: 0160 94919002


Wunschliefertermin:

23.08.2022


Lieferadresse:

Matthias Anton |

Am Spitzenberg 11

Blieskastel,

66440

Deutschland

Adresszusatz:

Phone: 0160 94919002


Kunden Email:

matthias.anton1@web.de


Vielen Dank,

Ihr Farben-Profi Team`

const emailWithQuantity = `Sehr geehrte Damen und Herren,


bitte folgende Bestellung an den Kunden liefern: #202224040.

Anzahl der Artikel: 6

Anzahl der Produkte: 1


Bestellung:

Artikel: StoLevell In Fill - 15KG

Variante: 15KG

SKU: 02970-001

Anzahl: 6


Kunden Bestellanmerkungen:

Bitte eine Stunde vorher Avis: 0176 64212576


Wunschliefertermin:

23.08.2022


Lieferadresse:

dimitrij mertes |

Rohrweg 37

Kutenholz,

27449

Deutschland

Adresszusatz:

Phone: 0176 64212576


Kunden Email:

dimon2@gmx.net


Vielen Dank,

Ihr Farben-Profi Team`



const emailWithMissingAddress = `Sehr geehrte Damen und Herren,


bitte folgende Bestellung an den Kunden liefern: #202224040.

Anzahl der Artikel: 6

Anzahl der Produkte: 1


Bestellung:

Artikel: StoLevell In Fill - 15KG

Variante: 15KG

SKU: 02970-001

Anzahl: 6


Kunden Bestellanmerkungen:

Bitte eine Stunde vorher Avis: 0176 64212576


Wunschliefertermin:

23.08.2022



dimitrij mertes |

Rohrweg 37

Kutenholz,

27449

Deutschland

Adresszusatz:

Phone: 0176 64212576


Kunden Email:

dimon2@gmx.net


Vielen Dank,

Ihr Farben-Profi Team`



const emailWithBrokenAddress = `Sehr geehrte Damen und Herren,


bitte folgende Bestellung an den Kunden liefern: #202224040.

Anzahl der Artikel: 6

Anzahl der Produkte: 1


Bestellung:

Artikel: StoLevell In Fill - 15KG

Variante: 15KG

SKU: 02970-001

Anzahl: 6


Kunden Bestellanmerkungen:

Bitte eine Stunde vorher Avis: 0176 64212576


Wunschliefertermin:

23.08.2022


Lieferadresse:



Kunden Email:

dimon2@gmx.net


Vielen Dank,

Ihr Farben-Profi Team`



const emailWithBrokenName = `Sehr geehrte Damen und Herren,


bitte folgende Bestellung an den Kunden liefern: #202224040.

Anzahl der Artikel: 6

Anzahl der Produkte: 1


Bestellung:

Artikel: StoLevell In Fill - 15KG

Variante: 15KG

SKU: 02970-001

Anzahl: 6


Kunden Bestellanmerkungen:

Bitte eine Stunde vorher Avis: 0176 64212576


Wunschliefertermin:

23.08.2022


Lieferadresse:

|

Rohrweg 37

Kutenholz,

27449

Deutschland

Adresszusatz:

Phone: 0176 64212576


Kunden Email:

dimon2@gmx.net


Vielen Dank,

Ihr Farben-Profi Team`



const emailWithBrokenCompany = `Sehr geehrte Damen und Herren,


bitte folgende Bestellung an den Kunden liefern: #202224040.

Anzahl der Artikel: 6

Anzahl der Produkte: 1


Bestellung:

Artikel: StoLevell In Fill - 15KG

Variante: 15KG

SKU: 02970-001

Anzahl: 6


Kunden Bestellanmerkungen:

Bitte eine Stunde vorher Avis: 0176 64212576


Wunschliefertermin:

23.08.2022


Lieferadresse:

dimitri

Rohrweg 37

Kutenholz,

27449

Deutschland

Adresszusatz:

Phone: 0176 64212576


Kunden Email:

dimon2@gmx.net


Vielen Dank,

Ihr Farben-Profi Team`



const emailWithMissingPhone = `Sehr geehrte Damen und Herren,


bitte folgende Bestellung an den Kunden liefern: #202224040.

Anzahl der Artikel: 6

Anzahl der Produkte: 1


Bestellung:

Artikel: StoLevell In Fill - 15KG

Variante: 15KG

SKU: 02970-001

Anzahl: 6


Kunden Bestellanmerkungen:

Bitte eine Stunde vorher Avis: 0176 64212576


Wunschliefertermin:

23.08.2022


Lieferadresse:

dimitri |

Rohrweg 37

Kutenholz,

27449

Deutschland

Adresszusatz:

Phone: 


Kunden Email:

dimon2@gmx.net


Vielen Dank,

Ihr Farben-Profi Team`


const emailWithMissingStreet = `Sehr geehrte Damen und Herren,


bitte folgende Bestellung an den Kunden liefern: #202224040.

Anzahl der Artikel: 6

Anzahl der Produkte: 1


Bestellung:

Artikel: StoLevell In Fill - 15KG

Variante: 15KG

SKU: 02970-001

Anzahl: 6


Kunden Bestellanmerkungen:

Bitte eine Stunde vorher Avis: 0176 64212576


Wunschliefertermin:

23.08.2022


Lieferadresse:

dimitri |

 37

Kutenholz,

27449

Deutschland

Adresszusatz:

Phone: 0176 64212576


Kunden Email:

dimon2@gmx.net


Vielen Dank,

Ihr Farben-Profi Team`


const emailWithMissingStreetNumber = `Sehr geehrte Damen und Herren,


bitte folgende Bestellung an den Kunden liefern: #202224040.

Anzahl der Artikel: 6

Anzahl der Produkte: 1


Bestellung:

Artikel: StoLevell In Fill - 15KG

Variante: 15KG

SKU: 02970-001

Anzahl: 6


Kunden Bestellanmerkungen:

Bitte eine Stunde vorher Avis: 0176 64212576


Wunschliefertermin:

23.08.2022


Lieferadresse:

dimitri |

Rohrweg 

Kutenholz,

27449

Deutschland

Adresszusatz:

Phone: 0176 64212576


Kunden Email:

dimon2@gmx.net


Vielen Dank,

Ihr Farben-Profi Team`


const emailWithMissingZip = `Sehr geehrte Damen und Herren,


bitte folgende Bestellung an den Kunden liefern: #202224040.

Anzahl der Artikel: 6

Anzahl der Produkte: 1


Bestellung:

Artikel: StoLevell In Fill - 15KG

Variante: 15KG

SKU: 02970-001

Anzahl: 6


Kunden Bestellanmerkungen:

Bitte eine Stunde vorher Avis: 0176 64212576


Wunschliefertermin:

23.08.2022


Lieferadresse:

dimitri |

Rohrweg 37

Kutenholz,

0

Deutschland

Adresszusatz:

Phone: 0176 64212576


Kunden Email:

dimon2@gmx.net


Vielen Dank,

Ihr Farben-Profi Team`


const emailWithMissingCity = `Sehr geehrte Damen und Herren,


bitte folgende Bestellung an den Kunden liefern: #202224040.

Anzahl der Artikel: 6

Anzahl der Produkte: 1


Bestellung:

Artikel: StoLevell In Fill - 15KG

Variante: 15KG

SKU: 02970-001

Anzahl: 6


Kunden Bestellanmerkungen:

Bitte eine Stunde vorher Avis: 0176 64212576


Wunschliefertermin:

23.08.2022


Lieferadresse:

dimitri |

Rohrweg 37

,

27449

Deutschland

Adresszusatz:

Phone: 0176 64212576


Kunden Email:

dimon2@gmx.net


Vielen Dank,

Ihr Farben-Profi Team`