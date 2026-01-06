const { Station } = require('../models');
const { success, error } = require('../utils/response');

/**
 * 获取站点列表
 */
const getStations = async (req, res) => {
  try {
    const stations = await Station.findAll({
      order: [['sortOrder', 'ASC']]
    });
    res.json(success(stations));
  } catch (err) {
    console.error('获取站点列表错误:', err);
    res.status(500).json(error('获取站点列表失败', 500));
  }
};

/**
 * 创建站点
 */
const createStation = async (req, res) => {
  try {
    const { stationName, sortOrder = 0 } = req.body;
    
    if (!stationName) {
      return res.status(400).json(error('站点名称不能为空', 400));
    }
    
    const station = await Station.create({
      stationName,
      sortOrder
    });
    
    res.json(success(station, '创建成功'));
  } catch (err) {
    console.error('创建站点错误:', err);
    res.status(500).json(error('创建站点失败', 500));
  }
};

/**
 * 更新站点
 */
const updateStation = async (req, res) => {
  try {
    const { id } = req.params;
    const { stationName, sortOrder } = req.body;
    
    const station = await Station.findByPk(id);
    if (!station) {
      return res.status(404).json(error('站点不存在', 404));
    }
    
    if (stationName !== undefined) station.stationName = stationName;
    if (sortOrder !== undefined) station.sortOrder = sortOrder;
    
    await station.save();
    
    res.json(success(station, '更新成功'));
  } catch (err) {
    console.error('更新站点错误:', err);
    res.status(500).json(error('更新站点失败', 500));
  }
};

/**
 * 删除站点
 */
const deleteStation = async (req, res) => {
  try {
    const { id } = req.params;
    
    const station = await Station.findByPk(id);
    if (!station) {
      return res.status(404).json(error('站点不存在', 404));
    }
    
    await station.destroy();
    
    res.json(success(null, '删除成功'));
  } catch (err) {
    console.error('删除站点错误:', err);
    res.status(500).json(error('删除站点失败', 500));
  }
};

module.exports = {
  getStations,
  createStation,
  updateStation,
  deleteStation
};

