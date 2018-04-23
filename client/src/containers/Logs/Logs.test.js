import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Todo from './Todo';

describe('Todo', () => {
  const wrapper = shallow(<Todo />);
  it('renders...', () => {
    expect(wrapper).to.have.length(1);
  });
});
