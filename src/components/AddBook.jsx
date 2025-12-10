import DialogBox from "./DialogBox";

const AddBook = ({ isOpen, onClose, onSubmit }) => {
  return (
    <div>
      <DialogBox
        DialogTitle="Add Book"
        submitButtonName="Add"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default AddBook;
