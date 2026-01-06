const { Building } = require('../models');
const { success, error } = require('../utils/response');

/**
 * 获取楼栋列表
 */
const getBuildings = async (req, res) => {
  try {
    const buildings = await Building.findAll({
      order: [['sortOrder', 'ASC']]
    });
    res.json(success(buildings));
  } catch (err) {
    console.error('获取楼栋列表错误:', err);
    res.status(500).json(error('获取楼栋列表失败', 500));
  }
};

/**
 * 创建楼栋
 */
const createBuilding = async (req, res) => {
  try {
    const { buildingName, sortOrder = 0 } = req.body;
    
    if (!buildingName) {
      return res.status(400).json(error('楼栋名称不能为空', 400));
    }
    
    const building = await Building.create({
      buildingName,
      sortOrder
    });
    
    res.json(success(building, '创建成功'));
  } catch (err) {
    console.error('创建楼栋错误:', err);
    res.status(500).json(error('创建楼栋失败', 500));
  }
};

/**
 * 更新楼栋
 */
const updateBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    const { buildingName, sortOrder } = req.body;
    
    const building = await Building.findByPk(id);
    if (!building) {
      return res.status(404).json(error('楼栋不存在', 404));
    }
    
    if (buildingName !== undefined) building.buildingName = buildingName;
    if (sortOrder !== undefined) building.sortOrder = sortOrder;
    
    await building.save();
    
    res.json(success(building, '更新成功'));
  } catch (err) {
    console.error('更新楼栋错误:', err);
    res.status(500).json(error('更新楼栋失败', 500));
  }
};

/**
 * 删除楼栋
 */
const deleteBuilding = async (req, res) => {
  try {
    const { id } = req.params;
    
    const building = await Building.findByPk(id);
    if (!building) {
      return res.status(404).json(error('楼栋不存在', 404));
    }
    
    await building.destroy();
    
    res.json(success(null, '删除成功'));
  } catch (err) {
    console.error('删除楼栋错误:', err);
    res.status(500).json(error('删除楼栋失败', 500));
  }
};

module.exports = {
  getBuildings,
  createBuilding,
  updateBuilding,
  deleteBuilding
};

