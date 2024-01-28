import React, { useState, useEffect, Fragment } from 'react';
import './CustomTable.css';

const CustomTable = () => {
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [editUserDetails, setEditUserDetails] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
      );

      const data = await response.json();
      setData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSingleDelete = (id) => {
    const dataAfterDelete = data.filter((each) => each.id !== id);
    const newSelectedRows = selectedRows.filter((each) => each !== id);
    setData(dataAfterDelete);
    setSelectedRows(newSelectedRows);
  };

  const handleEdit = (user) => {
    setEditUserDetails(user);
  };

  const handleConfirmEdit = () => {
    if (
      !editUserDetails.name ||
      !editUserDetails.email ||
      !editUserDetails.role
    ) {
      alert('Fields can not be left blank');
    } else {
      const dataAfterEdit = data.map((each) => {
        if (each.id === editUserDetails.id) {
          return {
            ...each,
            name: editUserDetails.name,
            email: editUserDetails.email,
            role: editUserDetails.role,
          };
        }
        return each;
      });
      setData(dataAfterEdit);
      setEditUserDetails({});
    }
  };

  const renderActionButtons = (user) => {
    return (
      <div>
        {user.id === editUserDetails.id ? (
          <button onClick={() => setEditUserDetails({})} className="edit">
            Cancel
          </button>
        ) : (
          <button onClick={() => handleEdit(user)} className="edit">
            Edit
          </button>
        )}
        {user.id === editUserDetails.id ? (
          <button onClick={handleConfirmEdit} className="edit">
            Confirm
          </button>
        ) : (
          <button
            onClick={() => handleSingleDelete(user.id)}
            className="delete"
          >
            Delete
          </button>
        )}
      </div>
    );
  };

  const handlePageClick = (each) => {
    if (!(each === currentPage)) {
      setSelectedRows([]);
      setCurrentPage(each);
    }
  };

  const renderPagination = (data) => {
    let totalPages = Math.ceil(data.length / 10);
    let pagesArr = [];
    for (let i = 1; i <= totalPages; i++) {
      pagesArr.push(i);
    }
    return (
      <ul className="pagination-container">
        <li>
          <button
            className={`page-btn first-page ${
              currentPage === 1 && 'disabled-page-btn'
            }`}
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage(1), setSelectedRows([]);
            }}
          >
            &lt;&lt;
          </button>
        </li>
        <li>
          <button
            className={`page-btn previous-page ${
              currentPage === 1 && 'disabled-page-btn'
            }`}
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage(currentPage - 1), setSelectedRows([]);
            }}
          >
            &lt;
          </button>
        </li>
        {pagesArr.map((each) => (
          <li key={each}>
            <button
              onClick={() => handlePageClick(each)}
              className={`${
                each === currentPage && 'active-page-btn'
              } page-btn`}
            >
              {each}
            </button>
          </li>
        ))}
        <li>
          <button
            className={`page-btn next-page ${
              currentPage === totalPages && 'disabled-page-btn'
            }`}
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage(currentPage + 1), setSelectedRows([]);
            }}
          >
            &gt;
          </button>
        </li>
        <li>
          <button
            className={`page-btn last-page ${
              currentPage === totalPages && 'disabled-page-btn'
            }`}
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage(totalPages), setSelectedRows([]);
            }}
          >
            &gt;&gt;
          </button>
        </li>
      </ul>
    );
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const handleCheckboxClick = (id) => {
    if (selectedRows.includes(id)) {
      let newSelectedRows = selectedRows.filter((each) => each !== id);
      setSelectedRows(newSelectedRows);
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleMultiSelect = (data) => {
    if (data.length === selectedRows.length) {
      setSelectedRows([]);
    } else {
      const newSelectedRows = data.map((each) => each.id);
      setSelectedRows(newSelectedRows);
    }
  };

  const handleMultiDelete = () => {
    let newData = data.filter((each) => !selectedRows.includes(each.id));
    setData(newData);
    setSelectedRows([]);
  };

  return (
    <div className="table-container">
      <h1 className="heading">Admin UI</h1>
      <header className="header">
        <input
          className="search-icon"
          type="search"
          onChange={handleSearch}
          value={searchInput}
          placeholder="Search by name, email or role"
        />
      </header>
      <div>
        {data.filter(
          (each) =>
            each.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            each.email.toLowerCase().includes(searchInput.toLowerCase()) ||
            each.role.toLowerCase().includes(searchInput.toLowerCase())
        ).length !== 0 ? (
          <>
            <table>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        data
                          .filter(
                            (each) =>
                              each.name
                                .toLowerCase()
                                .includes(searchInput.toLowerCase()) ||
                              each.email
                                .toLowerCase()
                                .includes(searchInput.toLowerCase()) ||
                              each.role
                                .toLowerCase()
                                .includes(searchInput.toLowerCase())
                          )
                          .slice(
                            currentPage * itemsPerPage - itemsPerPage,
                            currentPage * itemsPerPage
                          ).length === selectedRows.length
                      }
                      onChange={() =>
                        handleMultiSelect(
                          data
                            .filter(
                              (each) =>
                                each.name
                                  .toLowerCase()
                                  .includes(searchInput.toLowerCase()) ||
                                each.email
                                  .toLowerCase()
                                  .includes(searchInput.toLowerCase()) ||
                                each.role
                                  .toLowerCase()
                                  .includes(searchInput.toLowerCase())
                            )
                            .slice(
                              currentPage * itemsPerPage - itemsPerPage,
                              currentPage * itemsPerPage
                            )
                        )
                      }
                    />
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data
                  .filter(
                    (each) =>
                      each.name
                        .toLowerCase()
                        .includes(searchInput.toLowerCase()) ||
                      each.email
                        .toLowerCase()
                        .includes(searchInput.toLowerCase()) ||
                      each.role
                        .toLowerCase()
                        .includes(searchInput.toLowerCase())
                  )
                  .slice(
                    currentPage * itemsPerPage - itemsPerPage,
                    currentPage * itemsPerPage
                  )
                  .map((each) => {
                    return (
                      <tr
                        key={each.id}
                        className={`${selectedRows.includes(each.id) && 'row'}`}
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(each.id)}
                            onChange={() => handleCheckboxClick(each.id)}
                          />
                        </td>
                        <td>
                          {each.id === editUserDetails.id ? (
                            <input
                              type="text"
                              value={editUserDetails.name}
                              onChange={(e) =>
                                setEditUserDetails({
                                  ...editUserDetails,
                                  name: e.target.value,
                                })
                              }
                            />
                          ) : (
                            each.name
                          )}
                        </td>
                        <td>
                          {each.id === editUserDetails.id ? (
                            <input
                              type="text"
                              value={editUserDetails.email}
                              onChange={(e) =>
                                setEditUserDetails({
                                  ...editUserDetails,
                                  email: e.target.value,
                                })
                              }
                            />
                          ) : (
                            each.email
                          )}
                        </td>
                        <td>
                          {each.id === editUserDetails.id ? (
                            <input
                              type="text"
                              value={editUserDetails.role}
                              onChange={(e) =>
                                setEditUserDetails({
                                  ...editUserDetails,
                                  role: e.target.value,
                                })
                              }
                            />
                          ) : (
                            each.role
                          )}
                        </td>
                        <td>{renderActionButtons(each)}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <footer className="footer">
              <button
                className={`multi-delete-btn ${
                  selectedRows.length === 0 && 'disabled-btn'
                }`}
                disabled={selectedRows.length === 0}
                onClick={handleMultiDelete}
              >
                Delete Selected
              </button>
              {renderPagination(
                data.filter(
                  (each) =>
                    each.name
                      .toLowerCase()
                      .includes(searchInput.toLowerCase()) ||
                    each.email
                      .toLowerCase()
                      .includes(searchInput.toLowerCase()) ||
                    each.role.toLowerCase().includes(searchInput.toLowerCase())
                )
              )}
            </footer>
          </>
        ) : (
          <h1 className="heading">No Data Found</h1>
        )}
      </div>
    </div>
  );
};

export default CustomTable;
