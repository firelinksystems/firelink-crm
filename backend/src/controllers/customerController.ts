import { Request, Response } from 'express';
import { CustomerService } from '../services/customerService';

export class CustomerController {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService();
  }

  getAllCustomers = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10, search } = req.query;
      const result = await this.customerService.getAllCustomers({
        page: Number(page),
        limit: Number(limit),
        search: search as string
      });
      
      res.json({
        success: true,
        data: result.customers,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch customers' });
    }
  };

  getCustomerById = async (req: Request, res: Response) => {
    try {
      const customer = await this.customerService.getCustomerById(req.params.id);
      
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      
      res.json({
        success: true,
        data: customer
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch customer' });
    }
  };

  createCustomer = async (req: Request, res: Response) => {
    try {
      const customerData = req.body;
      const newCustomer = await this.customerService.createCustomer(customerData);
      
      res.status(201).json({
        success: true,
        data: newCustomer
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create customer' });
    }
  };

  updateCustomer = async (req: Request, res: Response) => {
    try {
      const updatedCustomer = await this.customerService.updateCustomer(
        req.params.id,
        req.body
      );
      
      res.json({
        success: true,
        data: updatedCustomer
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update customer' });
    }
  };

  deleteCustomer = async (req: Request, res: Response) => {
    try {
      await this.customerService.deleteCustomer(req.params.id);
      
      res.json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete customer' });
    }
  };
}
