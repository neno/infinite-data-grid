import { useEffect, useState } from 'react';
import { fetchPosts } from '../api/posts';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const limit = 20;

export const GridLoadOnScroll = () => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(0);

  const columnDefs = [
    {
      headerName: 'ID',
      field: 'id',
      sortable: true,
      filter: true,
    },
    { headerName: 'User Id', field: 'userId', sortable: true, filter: true },
    { headerName: 'Title', field: 'title', sortable: true, filter: true },
    { headerName: 'Body', field: 'body', sortable: true, filter: true },
  ];

  // Load initial data
  useEffect(() => setPage(1), []);

  useEffect(() => {
    if (page) {
      const loadNewPosts = async () => {
        const newPosts = await fetchPosts(page, limit);
        setRowData((prev) => [...prev, ...newPosts]);
      };
      loadNewPosts();
    }
  }, [page]);

  const getRowId = (row: any) => {
    console.log('getRowId', row.data.id);
    return row.data.id;
  };

  const findLastRow = () => {
    const lastRowIdx = rowData.length - 1;
    // Check if last row is rendered by ag-grid
    const lastRow = document.querySelector(`[row-index="${lastRowIdx}"]`);
    // If last row is rendered, load more data
    if (lastRow) {
      loadMore();
    }
  };

  const loadMore = () => {
    console.log('loadMore');

    setPage((prev) => prev + 1);
  };

  const onBodyScrollEnd = (event: any) => {
    console.log('onBodyScrollEnd', event);
    findLastRow();
  };

  if (rowData.length === 0) {
    return <p>"Loading..."</p>;
  }

  return (
    <div
      style={{
        width: 800,
        height: 400,
        color: 'black',
        border: '1em solid yellow',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'orange',
          overflowX: 'hidden',
          overflowY: 'hidden',
        }}
      >
        <AgGridReact
          gridOptions={{
            rowModelType: 'clientSide',
            columnDefs: columnDefs,
          }}
          rowData={rowData}
          getRowId={getRowId}
          rowModelType='clientSide'
          onBodyScrollEnd={onBodyScrollEnd}
          onGridReady={(params) => params.api.sizeColumnsToFit()}
        />
      </div>
    </div>
  );
};
