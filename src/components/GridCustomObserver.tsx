import { forwardRef, useEffect, useRef, useState } from 'react';
import { fetchPosts } from '../api/posts';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const limit = 20;

const CustomCellRenderer = forwardRef((props: any, ref: any) => {
  const { rowIndex, value, lastIndexRef, loadMore } = props;
  // console.log('CustomCellRenderer', props, props.lastIndexRef());
  const lastIndex = lastIndexRef();
  // console.log('CustomCellRenderer', value, rowIndex, lastIndex);
  // const refLastRow = useRef<HTMLDivElement | null>(null);

  console.log(
    'CustomCellRenderer',
    rowIndex,
    lastIndex,
    rowIndex === lastIndex
  );

  if (rowIndex === lastIndex) {
    // props.loadMore();
    return (
      <div style={{ backgroundColor: 'red' }} ref={ref}>
        {value}/{lastIndex}
      </div>
    );
  }

  return <div>{value}</div>;
});

export const GridCustomObserver = () => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(0);
  const lastIndexRef = useRef<number>(0);
  const lastRowRef = useRef<HTMLDivElement | null>(null);

  const columnDefs = [
    {
      headerName: 'ID',
      field: 'id',
      sortable: true,
      filter: true,
      cellRenderer: CustomCellRenderer,
      cellRendererParams: {
        color: 'red',
        lastIndexRef: () => lastIndexRef.current,
        loadMore: () => loadMore,
        lastRowRef,
      },
    },
    { headerName: 'User Id', field: 'userId', sortable: true, filter: true },
    { headerName: 'Title', field: 'title', sortable: true, filter: true },
    { headerName: 'Body', field: 'body', sortable: true, filter: true },
  ];

  const updateLastIndex = () => (lastIndexRef.current += limit - 1);

  // Load initial data
  useEffect(() => {
    setPage(1);
  }, []);

  useEffect(() => {
    if (page) {
      const loadNewPosts = async () => {
        const newPosts = await fetchPosts(page, limit);

        if (newPosts.length > 0) {
          console.log('loadNewPosts', newPosts);

          setRowData((prev) => [...prev, ...newPosts]);
          updateLastIndex();
        }
      };
      loadNewPosts();
    }
  }, [page]);

  const getRowId = (row: any) => {
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
    <>
      <h1>Last Index: {lastIndexRef.current}</h1>
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
            // onBodyScrollEnd={onBodyScrollEnd}
            onGridReady={(params) => params.api.sizeColumnsToFit()}
          />
        </div>
      </div>
    </>
  );
};
