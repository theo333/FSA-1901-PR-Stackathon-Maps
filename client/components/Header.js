import React from 'react';

const Header = () => {
  return (
    <header id="page-header" className="d-flex flex-row mt-3 mb-2 justify-content-center">
      <h1>Do U Deliver</h1>
      <div className="d-flex flex-row">
        <div className="ml-4">
          In Delivery Zone 1 <br />
          17 Hamilton Avenue, Clifton, New Jersey 07011
        </div>
        <div className="ml-4">
          In Delivery Zone 2 <br />
          900 Allwood Road, Clifton, New Jersey 07012
        </div>
        <div className="ml-4">
          Do Not Deliver <br />
          35 Pearl Street, Paterson, New Jersey 07501
        </div>
      </div>
    </header>
  );
};

export default Header;

// 5: 900 Allwood Road, Clifton, New Jersey 07012
// 3: 17 Hamilton Avenue, Clifton, New Jersey 07011
// 0: 35 Pearl Street, Paterson, New Jersey 07501
