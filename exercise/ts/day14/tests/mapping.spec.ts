import { ChildMapper } from '../src/children/childMapper';
import type { X5T78 } from '../src/children/db2/x5T78';
import type { Child } from '../src/children/dtos/child';

describe('ChildMapper', () => {
  it('should map X5T78 to Child (Girl)', () => {
    const db2Child: X5T78 = {
      Id: '1',
      N_1: 'Alice',
      N_2: 'Marie',
      N_3: 'Smith',
      CityOfBirth__pc: 'Paradise',
      Person_BD: '2017-03-19',
      Salutation: 'Girl',
      Type_pc: 'PPMPX_09/1',
      Serv__Gender__TYPE_pc: 'X',
      DeclaredMonthlySalary__c: '0',
      LegalDocumentExpirationDate1__c: '2030-09-01',
      LegalDocumentIssuingCountry1__c: 'Paradise',
      LegalDocumentName1__c: 'ID',
      LegalDocumentNumber1__c: '9892389098',
      ST_Num: '123',
      ST____Name: 'Sunny Street',
      ST_C: 'Paradise',
      ST_CID: '99',
    };

    const child: Child = ChildMapper.toDto(db2Child);

    expect(child).toMatchInlineSnapshot(`
Child {
  "Address": Address {
    "City": "Paradise",
    "CountryId": 99,
    "Number": "123",
    "Street": "Sunny Street",
  },
  "BirthCity": "Paradise",
  "BirthDate": "2017-03-19",
  "FirstName": "Alice",
  "Gender": "Girl",
  "Id": "1",
  "LastName": "Smith",
  "MiddleName": "Marie",
}
`);
  });

  it('should map X5T78 to Child (Boy)', () => {
    const db2Child: X5T78 = {
      Id: '2',
      N_1: 'Bob',
      N_2: '',
      N_3: 'Brown',
      CityOfBirth__pc: 'Paradise',
      Person_BD: '2021-09-01',
      Salutation: 'Boy',
      Type_pc: 'PP0PLX_09/1',
      Serv__Gender__TYPE_pc: 'VJX',
      DeclaredMonthlySalary__c: '0',
      LegalDocumentExpirationDate1__c: '2078-09-12',
      LegalDocumentIssuingCountry1__c: 'Paradise',
      LegalDocumentName1__c: 'ID',
      LegalDocumentNumber1__c: '9U129731873191JK',
      ST_Num: '9',
      ST____Name: 'Oak Street',
      ST_C: 'Paradise',
      ST_CID: '98988',
    };

    const child: Child = ChildMapper.toDto(db2Child);

    expect(child).toMatchInlineSnapshot(`
Child {
  "Address": Address {
    "City": "Paradise",
    "CountryId": 98988,
    "Number": "9",
    "Street": "Oak Street",
  },
  "BirthCity": "Paradise",
  "BirthDate": "2021-09-01",
  "FirstName": "Bob",
  "Gender": "Boy",
  "Id": "2",
  "LastName": "Brown",
  "MiddleName": "",
}
`);
  });
});
