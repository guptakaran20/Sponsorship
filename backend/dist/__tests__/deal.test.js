"use strict";
describe('Deal Status Transitions', () => {
    const validTransitions = {
        PENDING: ['ACCEPTED', 'REJECTED', 'NEGOTIATING'],
        NEGOTIATING: ['ACCEPTED', 'REJECTED'],
        ACCEPTED: ['COMPLETED'],
        REJECTED: [],
        COMPLETED: [],
    };
    it('PENDING can transition to ACCEPTED, REJECTED, NEGOTIATING', () => {
        expect(validTransitions['PENDING']).toContain('ACCEPTED');
        expect(validTransitions['PENDING']).toContain('REJECTED');
        expect(validTransitions['PENDING']).toContain('NEGOTIATING');
    });
    it('REJECTED cannot transition to COMPLETED', () => {
        expect(validTransitions['REJECTED']).not.toContain('COMPLETED');
    });
    it('COMPLETED has no valid transitions', () => {
        expect(validTransitions['COMPLETED']).toHaveLength(0);
    });
    it('NEGOTIATING can transition to ACCEPTED or REJECTED', () => {
        expect(validTransitions['NEGOTIATING']).toContain('ACCEPTED');
        expect(validTransitions['NEGOTIATING']).toContain('REJECTED');
    });
});
