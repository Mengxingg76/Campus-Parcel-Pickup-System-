const { Notice } = require('../models');
const { success, error } = require('../utils/response');
const { Op } = require('sequelize');

/**
 * 获取通知列表
 */
const getNotices = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, keyword } = req.query;
    const offset = (page - 1) * pageSize;
    
    const where = {};
    if (keyword) {
      where[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { content: { [Op.like]: `%${keyword}%` } }
      ];
    }
    
    const { count, rows } = await Notice.findAndCountAll({
      where,
      limit: parseInt(pageSize),
      offset: parseInt(offset),
      order: [['publishTime', 'DESC']]
    });
    
    res.json(success({
      list: rows,
      total: count,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    }));
  } catch (err) {
    console.error('获取通知列表错误:', err);
    res.status(500).json(error('获取通知列表失败', 500));
  }
};

/**
 * 获取通知详情
 */
const getNoticeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notice = await Notice.findByPk(id);
    if (!notice) {
      return res.status(404).json(error('通知不存在', 404));
    }
    
    res.json(success(notice));
  } catch (err) {
    console.error('获取通知详情错误:', err);
    res.status(500).json(error('获取通知详情失败', 500));
  }
};

/**
 * 创建通知（管理员）
 */
const createNotice = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json(error('标题和内容不能为空', 400));
    }
    
    const notice = await Notice.create({
      title,
      content,
      publishTime: new Date()
    });
    
    res.json(success(notice, '创建成功'));
  } catch (err) {
    console.error('创建通知错误:', err);
    res.status(500).json(error('创建通知失败', 500));
  }
};

/**
 * 更新通知（管理员）
 */
const updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, publishTime } = req.body;
    
    const notice = await Notice.findByPk(id);
    if (!notice) {
      return res.status(404).json(error('通知不存在', 404));
    }
    
    if (title !== undefined) notice.title = title;
    if (content !== undefined) notice.content = content;
    if (publishTime !== undefined) notice.publishTime = publishTime;
    
    await notice.save();
    
    res.json(success(notice, '更新成功'));
  } catch (err) {
    console.error('更新通知错误:', err);
    res.status(500).json(error('更新通知失败', 500));
  }
};

/**
 * 删除通知（管理员）
 */
const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notice = await Notice.findByPk(id);
    if (!notice) {
      return res.status(404).json(error('通知不存在', 404));
    }
    
    await notice.destroy();
    
    res.json(success(null, '删除成功'));
  } catch (err) {
    console.error('删除通知错误:', err);
    res.status(500).json(error('删除通知失败', 500));
  }
};

module.exports = {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice
};

