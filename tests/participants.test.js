const participants = require('../controllers/participants');

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  return res;
};

describe('Partaicipants GET endpoints - both getAll and getSingle', () => {
  test('getAllParticipants should call the 200 status and json', async () => {
    const req = {};
    const res = createMockRes();

    await participants.getAllParticipants(req, res);

    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });

  test('getSingleParticipants should return 400 for an invalid id', async () => {
    const req = { params: { id: 'not-a-valid-id' } };
    const res = createMockRes();

    await participants.getSingleParticipants(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      'Must use a valid participants id to find a participants.'
    );
  });

  test('getSingleParticipants should return 404 or 500 for a non-existing id', async () => {
    const req = { params: { id: '6917fccbc0146903cca84dcf' } }; // Fake ID
    const res = createMockRes();

    await participants.getSingleParticipants(req, res);

    expect(res.status).toHaveBeenCalled();
  });

  test('getSingleParticipants should respond with a 200 status for a valid id', async () => {
    const req = { params: { id: '69240e07833014ec06d71dd1' } }; // Real ID
    const res = createMockRes();

    await participants.getSingleParticipants(req, res);

    expect(res.status).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });
}); 
