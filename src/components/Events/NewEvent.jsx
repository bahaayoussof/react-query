import { Link, useNavigate } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useMutation } from '@tanstack/react-query';
import { createEvent } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { queryClient } from '../../util/http.js';

export default function NewEvent() {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      // ? one of the syntaxes below is correct
      // queryClient.invalidateQueries('events');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      navigate('../');
    }
  });

  function handleSubmit(formData) {
    const res = mutate({ event: formData });
    console.log(res);
  }

  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && <p>Submitting...</p>}
        {!isPending && <>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            Create
          </button>
        </>}
      </EventForm>
      {isError && <ErrorBlock title="Faild to create event!" message={error.info?.message || 'Invalid data provided'} />}
    </Modal>
  );
}
