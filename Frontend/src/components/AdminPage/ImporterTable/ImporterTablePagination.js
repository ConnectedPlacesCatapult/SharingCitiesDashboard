import React from 'react';
import PropTypes from 'prop-types';
import TablePagination from "@material-ui/core/TablePagination";

class ImporterTablePagination extends React.Component {
  render() {
    const { data, rowsPerPage, page, onChangePage, onChangeRowsPerPage } = this.props;

    return (
      <TablePagination
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{ 'aria-label': 'Previous Page' }}
        nextIconButtonProps={{ 'aria-label': 'Next Page' }}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
    )
  }
}

ImporterTablePagination.propTypes = {
  data: PropTypes.array.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
};

export default ImporterTablePagination
